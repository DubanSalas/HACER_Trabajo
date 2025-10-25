import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  
  // Configuración para evitar errores de CORS durante desarrollo
  public readonly useMockData = true; // Cambiar a false cuando CORS esté solucionado
  public readonly showCorsErrors = false; // No mostrar errores de CORS en consola
  
  constructor() {
    if (this.useMockData) {
      console.log('🔧 App configurada para usar datos mock (CORS bypass activado)');
    }
  }

  shouldUseMockData(): boolean {
    return this.useMockData;
  }

  shouldShowCorsErrors(): boolean {
    return this.showCorsErrors;
  }
}