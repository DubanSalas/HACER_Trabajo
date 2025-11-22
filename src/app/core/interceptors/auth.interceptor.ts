import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Excluir endpoints públicos de autenticación y ubicaciones
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/api/locations'  // Endpoints de ubicación para registro
    ];
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint) {
      console.log('🔓 Endpoint público, sin token:', req.url);
      return next.handle(req);
    }

    const token = this.authService.getToken();

    console.log('🔐 AuthInterceptor - URL:', req.url);
    console.log('🔐 Token disponible:', token ? 'SÍ' : 'NO');

    if (token) {
      console.log('🔐 Token (primeros 20 chars):', token.substring(0, 20) + '...');

      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      console.log('✅ Request con Authorization header enviado');

      return next.handle(authReq).pipe(
        tap(() => {
          console.log('✅ Request exitoso para:', req.url);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error en request:', req.url);
          console.error('❌ Status:', error.status);
          console.error('❌ Error:', error.message);

          // Solo redirigir al login si es 401 (no autenticado)
          // 403 significa que estás autenticado pero no tienes permisos
          if (error.status === 401) {
            console.warn('⚠️ Token inválido o expirado, redirigiendo al login...');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            console.warn('⚠️ Acceso denegado (403) - No tienes permisos para este recurso');
            // No redirigir, solo mostrar el error
          }

          return throwError(() => error);
        })
      );
    }

    console.warn('⚠️ No hay token disponible para:', req.url);

    // Continuar sin token - el backend decidirá si es necesario
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Solo redirigir si es 401 (no autenticado)
        if (error.status === 401) {
          console.warn('⚠️ 401 - Redirigiendo al login...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}