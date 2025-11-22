import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

interface ErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  code?: string;
  path?: string;
  validationErrors?: { [key: string]: string };
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    const currentUrl = this.router.url;
    const isAuthRoute = currentUrl.includes('/auth/');
    
    // No mostrar alertas en rutas de autenticación para 401/403
    if (isAuthRoute && (error.status === 401 || error.status === 403)) {
      return;
    }

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (red, etc.)
      this.alertService.error(`Error de conexión: ${error.error.message}`);
      return;
    }

    // Error del lado del servidor
    const errorResponse: ErrorResponse = error.error;

    switch (error.status) {
      case 400:
        this.handle400Error(errorResponse);
        break;
      case 401:
        this.handle401Error(errorResponse, isAuthRoute);
        break;
      case 403:
        this.handle403Error(errorResponse);
        break;
      case 404:
        this.handle404Error(errorResponse);
        break;
      case 409:
        this.handle409Error(errorResponse);
        break;
      case 422:
        this.handle422Error(errorResponse);
        break;
      case 500:
        this.handle500Error(errorResponse);
        break;
      case 503:
        this.alertService.error('Servicio no disponible. Intente nuevamente más tarde.');
        break;
      default:
        this.handleGenericError(error, errorResponse);
    }
  }

  private handle400Error(errorResponse: ErrorResponse): void {
    if (errorResponse.validationErrors) {
      // Mostrar errores de validación
      const errorMessages = Object.entries(errorResponse.validationErrors)
        .map(([field, message]) => `• ${field}: ${message}`)
        .join('\n');
      this.alertService.error(`Errores de validación:\n${errorMessages}`, 10000);
    } else {
      const message = errorResponse.message || 'Solicitud incorrecta. Verifique los datos enviados.';
      this.alertService.error(message);
    }
  }

  private handle401Error(errorResponse: ErrorResponse, isAuthRoute: boolean): void {
    const message = errorResponse.message || 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
    
    if (!isAuthRoute) {
      this.alertService.warning(message);
      this.authService.logout();
      setTimeout(() => {
        this.router.navigate(['/auth/user-type']);
      }, 2000);
    }
  }

  private handle403Error(errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 'No tiene permisos para realizar esta acción.';
    this.alertService.error(message);
  }

  private handle404Error(errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 'Recurso no encontrado.';
    this.alertService.warning(message);
  }

  private handle409Error(errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 'El recurso ya existe o está en uso.';
    this.alertService.warning(message);
  }

  private handle422Error(errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 'Datos de entrada inválidos.';
    this.alertService.error(message);
  }

  private handle500Error(errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 'Error interno del servidor. Intente nuevamente más tarde.';
    this.alertService.error(message, 8000);
  }

  private handleGenericError(error: HttpErrorResponse, errorResponse: ErrorResponse): void {
    const message = errorResponse.message || 
                   error.message || 
                   'Ha ocurrido un error inesperado';
    this.alertService.error(`Error ${error.status}: ${message}`);
  }
}