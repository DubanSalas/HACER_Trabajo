import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    enableNotifications: boolean;
    enableCache: boolean;
    enableRetry: boolean;
    maxRetries: number;
    cacheTimeout: number;
  };
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
  dateFormat: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private configSubject = new BehaviorSubject<AppConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  private defaultConfig: AppConfig = {
    apiUrl: 'http://localhost:8085',
    appName: 'DeliPedidos',
    version: '1.0.0',
    features: {
      enableNotifications: true,
      enableCache: true,
      enableRetry: true,
      maxRetries: 3,
      cacheTimeout: 300000 // 5 minutos
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100]
    },
    dateFormat: 'dd/MM/yyyy',
    currency: 'PEN'
  };

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  private loadConfig(): void {
    // Intentar cargar configuración desde el servidor
    this.http.get<AppConfig>('/assets/config/app-config.json').subscribe({
      next: (config) => {
        this.configSubject.next({ ...this.defaultConfig, ...config });
      },
      error: () => {
        // Si falla, usar configuración por defecto
        console.warn('No se pudo cargar la configuración del servidor, usando configuración por defecto');
        this.configSubject.next(this.defaultConfig);
      }
    });
  }

  getConfig(): AppConfig | null {
    return this.configSubject.value;
  }

  updateConfig(partialConfig: Partial<AppConfig>): void {
    const currentConfig = this.configSubject.value;
    if (currentConfig) {
      const updatedConfig = { ...currentConfig, ...partialConfig };
      this.configSubject.next(updatedConfig);
    }
  }

  // Métodos helper para acceder a configuraciones específicas
  getApiUrl(): string {
    return this.getConfig()?.apiUrl || this.defaultConfig.apiUrl;
  }

  getAppName(): string {
    return this.getConfig()?.appName || this.defaultConfig.appName;
  }

  getVersion(): string {
    return this.getConfig()?.version || this.defaultConfig.version;
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return Boolean(this.getConfig()?.features[feature] || this.defaultConfig.features[feature]);
  }

  getDefaultPageSize(): number {
    return this.getConfig()?.pagination.defaultPageSize || this.defaultConfig.pagination.defaultPageSize;
  }

  getPageSizeOptions(): number[] {
    return this.getConfig()?.pagination.pageSizeOptions || this.defaultConfig.pagination.pageSizeOptions;
  }
}