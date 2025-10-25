import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-simple-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h2>🔧 Test de Conectividad Simple</h2>
      
      <div class="test-info">
        <p><strong>Backend URL:</strong> {{ backendUrl }}</p>
        <p><strong>Test URL:</strong> {{ testUrl }}</p>
      </div>

      <button (click)="testConnection()" [disabled]="loading">
        {{ loading ? 'Probando...' : 'Probar Conexión' }}
      </button>

      <div class="results" *ngIf="result">
        <h3>Resultado:</h3>
        <div [ngClass]="result.success ? 'success' : 'error'">
          <p><strong>Estado:</strong> {{ result.success ? 'ÉXITO' : 'ERROR' }}</p>
          <p><strong>Status Code:</strong> {{ result.status }}</p>
          <p><strong>Mensaje:</strong> {{ result.message }}</p>
          <div *ngIf="result.data">
            <p><strong>Datos recibidos:</strong></p>
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
    .test-container {
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

    button {
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
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
export class SimpleTestComponent implements OnInit {
  backendUrl = environment.urlBackEnd;
  testUrl = `${environment.urlBackEnd}/v1/api/customer`;
  loading = false;
  result: any = null;
  logs: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.addLog('Componente inicializado');
    this.addLog(`Backend URL configurada: ${this.backendUrl}`);
  }

  async testConnection() {
    this.loading = true;
    this.result = null;
    this.logs = [];
    
    this.addLog('🔄 Iniciando test de conexión...');
    this.addLog(`📡 URL de prueba: ${this.testUrl}`);

    try {
      this.addLog('📤 Enviando petición HTTP GET...');
      
      const response = await this.http.get(this.testUrl, {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).toPromise();

      this.addLog(`📥 Respuesta recibida - Status: ${response?.status}`);
      this.addLog(`📋 Headers: ${JSON.stringify([...response?.headers.keys() || []])}`);

      if (response?.status === 200) {
        const data = response.body;
        this.addLog(`✅ Datos recibidos: ${Array.isArray(data) ? data.length : 'N/A'} registros`);
        
        this.result = {
          success: true,
          status: response.status,
          message: `Conexión exitosa! Recibidos ${Array.isArray(data) ? data.length : 'N/A'} registros`,
          data: Array.isArray(data) ? data.slice(0, 3) : data // Solo mostrar los primeros 3
        };
      } else {
        this.addLog(`⚠️ Status no esperado: ${response?.status}`);
        this.result = {
          success: false,
          status: response?.status || 'Unknown',
          message: `Status inesperado: ${response?.status}`,
          data: null
        };
      }

    } catch (error: any) {
      this.addLog(`❌ Error capturado: ${error.message}`);
      this.addLog(`🔍 Error status: ${error.status}`);
      this.addLog(`🔍 Error name: ${error.name}`);
      
      let message = 'Error desconocido';
      
      if (error.status === 0) {
        message = 'Error de CORS o red - El backend no es accesible';
        this.addLog('💡 Posibles causas: Backend no corriendo, CORS mal configurado, puerto incorrecto');
      } else if (error.status === 403) {
        message = 'Error 403 - Acceso denegado (problema de autenticación/autorización)';
        this.addLog('💡 Posible causa: El backend requiere autenticación o tiene restricciones de seguridad');
      } else if (error.status === 404) {
        message = 'Error 404 - Endpoint no encontrado';
        this.addLog('💡 Posible causa: La URL del endpoint es incorrecta o no existe');
      } else if (error.status >= 500) {
        message = 'Error del servidor - Problema interno del backend';
        this.addLog('💡 Posible causa: Error en el código del backend o base de datos');
      }

      this.result = {
        success: false,
        status: error.status || 'Network Error',
        message: message,
        data: null
      };
    } finally {
      this.loading = false;
      this.addLog('🏁 Test completado');
    }
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(message);
  }
}