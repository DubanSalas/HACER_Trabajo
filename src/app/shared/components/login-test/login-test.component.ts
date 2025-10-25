import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-test-container">
      <h2>🔐 Test de Login</h2>
      
      <div class="test-info">
        <p><strong>URL de Auth:</strong> {{ authUrl }}</p>
        <p><strong>Estado actual:</strong> {{ isLoggedIn ? 'Autenticado' : 'No autenticado' }}</p>
        <p><strong>Token:</strong> {{ currentToken || 'No hay token' }}</p>
      </div>

      <div class="login-form">
        <h3>Probar Login</h3>
        <div class="form-group">
          <label>Usuario:</label>
          <input [(ngModel)]="credentials.username" placeholder="admin" />
        </div>
        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" [(ngModel)]="credentials.password" placeholder="admin123" />
        </div>
        <button (click)="testLogin()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Probar Login' }}
        </button>
      </div>

      <div class="quick-tests">
        <h3>Tests Rápidos</h3>
        <button (click)="testWithDefaultCredentials()" [disabled]="loading">
          Test con admin/admin123
        </button>
        <button (click)="testAuthEndpoint()" [disabled]="loading">
          Test Endpoint Auth
        </button>
        <button (click)="clearAuth()">
          Limpiar Auth
        </button>
      </div>

      <div class="results" *ngIf="result">
        <h3>Resultado:</h3>
        <div [ngClass]="result.success ? 'success' : 'error'">
          <p><strong>Estado:</strong> {{ result.success ? 'ÉXITO' : 'ERROR' }}</p>
          <p><strong>Mensaje:</strong> {{ result.message }}</p>
          <div *ngIf="result.data">
            <p><strong>Datos:</strong></p>
            <pre>{{ result.data | json }}</pre>
          </div>
        </div>
      </div>

      <div class="logs" *ngIf="logs.length > 0">
        <h3>Logs:</h3>
        <div class="log-entry" *ngFor="let log of logs">
          {{ log }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    .test-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }

    .login-form, .quick-tests {
      background: #fff;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 15px 0;
    }

    .form-group {
      margin: 10px 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 10px 15px;
      margin: 5px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .results {
      margin: 20px 0;
      padding: 15px;
      border-radius: 5px;
    }

    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .logs {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 5px;
      max-height: 300px;
      overflow-y: auto;
    }

    .log-entry {
      font-family: monospace;
      font-size: 12px;
      margin: 2px 0;
      padding: 2px 5px;
      background: white;
      border-radius: 3px;
    }

    pre {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
      font-size: 12px;
    }
  `]
})
export class LoginTestComponent {
  authUrl = 'http://localhost:8085/v1/api/auth';
  loading = false;
  result: any = null;
  logs: string[] = [];
  
  credentials: LoginRequest = {
    username: 'admin',
    password: 'admin123'
  };

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentToken(): string | null {
    return this.authService.getToken();
  }

  async testLogin() {
    this.loading = true;
    this.result = null;
    this.logs = [];
    
    this.addLog('🔄 Iniciando test de login...');
    this.addLog(`📡 Credenciales: ${this.credentials.username} / ${this.credentials.password}`);

    try {
      this.addLog('📤 Enviando petición de login...');
      
      const response = await this.authService.login(this.credentials).toPromise();
      
      this.addLog('✅ Login exitoso!');
      this.addLog(`🎫 Token recibido: ${response?.token?.substring(0, 20)}...`);
      
      this.result = {
        success: true,
        message: 'Login exitoso!',
        data: {
          username: response?.username,
          roles: response?.roles,
          tokenPreview: response?.token?.substring(0, 50) + '...'
        }
      };

    } catch (error: any) {
      this.addLog(`❌ Error en login: ${error.message}`);
      this.addLog(`🔍 Status: ${error.status}`);
      this.addLog(`🔍 Error completo: ${JSON.stringify(error)}`);
      
      let message = 'Error desconocido';
      
      if (error.status === 0) {
        message = 'Error de CORS o red - No se puede conectar al backend';
      } else if (error.status === 401) {
        message = 'Credenciales incorrectas';
      } else if (error.status === 403) {
        message = 'Acceso denegado';
      } else if (error.status === 404) {
        message = 'Endpoint de login no encontrado';
      } else if (error.status >= 500) {
        message = 'Error del servidor';
      }

      this.result = {
        success: false,
        message: message,
        data: {
          status: error.status,
          statusText: error.statusText,
          url: error.url
        }
      };
    } finally {
      this.loading = false;
      this.addLog('🏁 Test completado');
    }
  }

  testWithDefaultCredentials() {
    this.credentials = {
      username: 'admin',
      password: 'admin123'
    };
    this.testLogin();
  }

  async testAuthEndpoint() {
    this.loading = true;
    this.result = null;
    this.logs = [];
    
    this.addLog('🔄 Probando disponibilidad del endpoint auth...');
    
    try {
      // Hacer una petición OPTIONS para ver si el endpoint existe
      const response = await fetch(`${this.authUrl}/login`, {
        method: 'OPTIONS'
      });
      
      this.addLog(`✅ Endpoint responde - Status: ${response.status}`);
      
      this.result = {
        success: true,
        message: `Endpoint disponible - Status: ${response.status}`,
        data: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        }
      };
      
    } catch (error: any) {
      this.addLog(`❌ Error probando endpoint: ${error.message}`);
      
      this.result = {
        success: false,
        message: 'Endpoint no disponible o error de CORS',
        data: error
      };
    } finally {
      this.loading = false;
    }
  }

  clearAuth() {
    this.authService.logout();
    this.addLog('🧹 Autenticación limpiada');
    this.result = {
      success: true,
      message: 'Autenticación limpiada correctamente',
      data: null
    };
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(message);
  }
}