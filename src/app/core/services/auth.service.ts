import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.urlBackEnd}/v1/api`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private redirectUrlKey = 'redirect_url';
  private contextKey = 'auth_context'; // 'admin' o 'customer'

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Método para establecer el contexto de autenticación
  private setAuthContext(role: string): void {
    const context = (role === 'CLIENTE') ? 'customer' : 'admin';
    localStorage.setItem(this.contextKey, context);
  }

  // Método para obtener el contexto actual
  private getAuthContext(): string {
    return localStorage.getItem(this.contextKey) || 'admin';
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('✅ AuthService: Enviando petición de login a:', `${this.apiUrl}/auth/login`);
    console.log('✅ AuthService: Credenciales:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('✅ AuthService: Respuesta JWT recibida:', response);
          
          // El backend devuelve {token: "...", user: {id, username, role}}
          const token = response.token || response.accessToken;
          const user = response.user || response;
          
          console.log('✅ Token extraído:', token);
          console.log('✅ Usuario extraído:', user);
          
          if (!token) {
            console.error('❌ ERROR: No se recibió token del backend');
            throw new Error('No se recibió token del backend');
          }
          
          // Guardar información del usuario
          const userInfo = {
            id: user.id || 1,
            username: user.username || 'admin',
            role: user.role || 'ADMIN'
          };
          
          console.log('✅ UserInfo procesado:', userInfo);
          
          // Establecer el contexto según el rol
          this.setAuthContext(userInfo.role);
          
          // Guardar el token en ambas claves para compatibilidad
          localStorage.setItem('accessToken', token);
          localStorage.setItem(this.tokenKey, token);
          console.log('✅ Token guardado en localStorage con clave accessToken');
          console.log('✅ Token guardado en localStorage con clave', this.tokenKey);
          console.log('✅ Contexto de autenticación:', this.getAuthContext());
          
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem(this.userKey, JSON.stringify(userInfo));
          
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(userInfo);
          
          // Verificar que se guardó correctamente
          const savedToken = localStorage.getItem('accessToken');
          const savedUserInfo = localStorage.getItem('userInfo');
          
          console.log('✅ Verificación - AccessToken guardado:', savedToken ? 'SÍ' : 'NO');
          console.log('✅ Verificación - UserInfo guardado:', savedUserInfo ? 'SÍ' : 'NO');
          
          if (!savedToken) {
            console.error('❌ ERROR CRÍTICO: El token no se guardó en localStorage');
          }
        })
      );
  }

  logout(): void {
    const context = this.getAuthContext();
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.redirectUrlKey);
    localStorage.removeItem(this.contextKey);
    
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Redirigir al login correspondiente según el contexto
    if (context === 'customer') {
      this.router.navigate(['/customer/login']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken') || localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo && userInfo !== '{}') {
      return JSON.parse(userInfo);
    }
    
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  getUserRoles(): string[] {
    const role = this.getUserRole();
    return role ? [role] : [];
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isEmployee(): boolean {
    return this.hasRole('EMPLEADO');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('🔍 isAuthenticated - Token existe:', !!token);
    
    if (!token) {
      console.log('❌ isAuthenticated - No hay token');
      return false;
    }
    
    // Verificar si el token ha expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('🔍 isAuthenticated - Payload:', payload);
      console.log('🔍 isAuthenticated - Tiempo actual:', currentTime);
      console.log('🔍 isAuthenticated - Token expira en:', payload.exp);
      console.log('🔍 isAuthenticated - Tiempo restante (segundos):', payload.exp - currentTime);
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('❌ isAuthenticated - Token expirado, haciendo logout');
        this.logout();
        return false;
      }
      
      console.log('✅ isAuthenticated - Token válido');
      return true;
    } catch (error) {
      // Si hay error al decodificar el token, considerarlo válido por ahora
      console.log('⚠️ isAuthenticated - Error al decodificar token, considerando válido:', error);
      return true;
    }
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem(this.redirectUrlKey, url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem(this.redirectUrlKey);
  }

  clearRedirectUrl(): void {
    localStorage.removeItem(this.redirectUrlKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}