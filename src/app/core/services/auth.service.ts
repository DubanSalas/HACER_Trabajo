import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}

export interface User {
  username: string;
  roles: string[];
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = `${environment.urlBackEnd}/v1/api/auth`;
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Cargar usuario desde localStorage al inicializar (solo en el navegador)
    if (this.isBrowser()) {
      const savedUser = this.getUserFromStorage();
      if (savedUser) {
        this.currentUserSubject.next(savedUser);
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔄 Attempting login with backend:', this.AUTH_URL);
    
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Login successful, token received');
        // Guardar token y usuario
        this.saveToken(response.token);
        const user: User = {
          username: response.username || credentials.username,
          roles: response.roles || ['USER'],
          token: response.token
        };
        this.saveUser(user);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        // Solo mostrar errores que no sean de CORS para evitar spam en consola
        if (error.status !== 0) {
          console.error('❌ Login error:', error);
        } else {
          console.log('ℹ️ CORS error detected - use bypass login to continue');
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    // Verificar tanto el token como el usuario actual
    const hasToken = !!this.getToken();
    const hasUser = !!this.getCurrentUser();
    return hasToken || hasUser;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isEmployee(): boolean {
    return this.hasRole('EMPLEADO');
  }

  // Obtener headers con token para las peticiones HTTP
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private saveUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser()) {
      return null;
    }
    
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        localStorage.removeItem(this.USER_KEY);
      }
    }
    return null;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}