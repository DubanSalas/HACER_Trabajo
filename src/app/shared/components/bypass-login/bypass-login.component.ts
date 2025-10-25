import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bypass-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bypass-container">
      <h2>🚀 Bypass Login (Solo para Testing)</h2>
      
      <div class="warning">
        <p>⚠️ Este componente es solo para testing y desarrollo</p>
        <p>Permite acceder al sistema sin autenticación real</p>
      </div>

      <div class="actions">
        <button (click)="bypassLogin()" class="bypass-btn">
          🔓 Entrar sin Login
        </button>
        <button (click)="goToLogin()" class="login-btn">
          🔐 Ir al Login Normal
        </button>
      </div>

      <div class="info">
        <h3>📋 Información:</h3>
        <p><strong>Estado actual:</strong> {{ isLoggedIn ? 'Autenticado' : 'No autenticado' }}</p>
        <p><strong>Usuario:</strong> {{ currentUser?.username || 'Ninguno' }}</p>
        <p><strong>Roles:</strong> {{ currentUser?.roles?.join(', ') || 'Ninguno' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .bypass-container {
      padding: 40px;
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .warning {
      background: #fff3cd;
      color: #856404;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #ffeaa7;
    }

    .actions {
      margin: 30px 0;
    }

    .bypass-btn {
      background: #28a745;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      margin: 10px;
      cursor: pointer;
    }

    .login-btn {
      background: #007bff;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      margin: 10px;
      cursor: pointer;
    }

    .info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }

    button:hover {
      opacity: 0.9;
    }
  `]
})
export class BypassLoginComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  bypassLogin() {
    // Crear un usuario temporal para testing
    const mockUser = {
      username: 'test-user',
      roles: ['ADMIN', 'USER'],
      token: 'mock-token-for-testing-' + Date.now()
    };

    // Simular que el usuario está logueado
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', mockUser.token);
      localStorage.setItem('auth-user', JSON.stringify(mockUser));
    }

    // Actualizar el estado del servicio
    (this.authService as any).currentUserSubject.next(mockUser);

    console.log('🚀 Bypass login activated - Mock user created');
    
    // Redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}