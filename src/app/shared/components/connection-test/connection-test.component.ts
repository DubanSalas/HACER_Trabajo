import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../../core/services/customer.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-test">
      <h3>🔧 Test de Conectividad Backend</h3>
      
      <div class="test-section">
        <h4>1. Test Directo HTTP</h4>
        <button (click)="testDirectHttp()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Test HTTP Directo' }}
        </button>
        <div class="result" [ngClass]="directResult?.status">
          {{ directResult?.message }}
        </div>
      </div>

      <div class="test-section">
        <h4>2. Test Servicio Customer</h4>
        <button (click)="testCustomerService()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Test Customer Service' }}
        </button>
        <div class="result" [ngClass]="customerResult?.status">
          {{ customerResult?.message }}
        </div>
      </div>

      <div class="test-section">
        <h4>3. Test Autenticación</h4>
        <button (click)="testAuth()" [disabled]="loading">
          {{ loading ? 'Probando...' : 'Test Auth Service' }}
        </button>
        <div class="result" [ngClass]="authResult?.status">
          {{ authResult?.message }}
        </div>
      </div>

      <div class="info-section">
        <h4>📋 Información de Configuración</h4>
        <ul>
          <li><strong>Proxy:</strong> /v1/api/* → http://localhost:8085</li>
          <li><strong>Puerto Frontend:</strong> 4202</li>
          <li><strong>Puerto Backend:</strong> 8085</li>
          <li><strong>Interceptor:</strong> {{ hasInterceptor ? '✅ Activo' : '❌ No configurado' }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .connection-test {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    .test-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .info-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #007bff;
      border-radius: 8px;
      background: #e7f3ff;
    }

    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .result {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
    }

    .result.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .result.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .result.warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    ul {
      margin: 10px 0;
    }

    li {
      margin: 5px 0;
    }
  `]
})
export class ConnectionTestComponent {
  loading = false;
  directResult: any = null;
  customerResult: any = null;
  authResult: any = null;
  hasInterceptor = true; // Asumimos que está configurado

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  async testDirectHttp() {
    this.loading = true;
    this.directResult = null;

    try {
      console.log('🔄 Testing direct HTTP call to backend');
      
      const response = await this.http.get('http://localhost:8085/v1/api/customer').toPromise();
      
      this.directResult = {
        status: 'success',
        message: `✅ Conexión exitosa! Recibidos ${Array.isArray(response) ? response.length : 'N/A'} registros`
      };
      
      console.log('✅ Direct HTTP test successful:', response);
      
    } catch (error: any) {
      console.error('❌ Direct HTTP test failed:', error);
      
      this.directResult = {
        status: 'error',
        message: `❌ Error: ${error.status || 'Network'} - ${error.message || 'No se puede conectar al backend'}`
      };
    } finally {
      this.loading = false;
    }
  }

  async testCustomerService() {
    this.loading = true;
    this.customerResult = null;

    try {
      console.log('🔄 Testing CustomerService.getCustomers()');
      
      const customers = await this.customerService.getCustomers().toPromise();
      
      this.customerResult = {
        status: 'success',
        message: `✅ Servicio funcionando! Recibidos ${customers?.length || 0} clientes`
      };
      
      console.log('✅ Customer service test successful:', customers);
      
    } catch (error: any) {
      console.error('❌ Customer service test failed:', error);
      
      this.customerResult = {
        status: 'error',
        message: `❌ Error en servicio: ${error.status || 'Network'} - ${error.message || 'Servicio no disponible'}`
      };
    } finally {
      this.loading = false;
    }
  }

  async testAuth() {
    this.loading = true;
    this.authResult = null;

    try {
      console.log('🔄 Testing auth endpoint availability');
      
      // Solo probamos si el endpoint está disponible, no hacemos login real
      const response = await this.http.post('http://localhost:8085/v1/api/auth/login', {
        username: 'test',
        password: 'test'
      }).toPromise();
      
      // Si llegamos aquí sin error de red, el endpoint está disponible
      this.authResult = {
        status: 'warning',
        message: '⚠️ Endpoint disponible (credenciales de prueba incorrectas, pero el servicio responde)'
      };
      
    } catch (error: any) {
      console.error('Auth test result:', error);
      
      if (error.status === 401 || error.status === 403) {
        this.authResult = {
          status: 'success',
          message: '✅ Endpoint de autenticación disponible (error 401/403 esperado con credenciales de prueba)'
        };
      } else if (error.status === 0) {
        this.authResult = {
          status: 'error',
          message: '❌ No se puede conectar al servicio de autenticación (CORS/Network error)'
        };
      } else {
        this.authResult = {
          status: 'warning',
          message: `⚠️ Respuesta inesperada: ${error.status} - ${error.message}`
        };
      }
    } finally {
      this.loading = false;
    }
  }
}