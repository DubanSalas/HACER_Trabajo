import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private maxRetries = 3;
  private retryDelay = 1000; // 1 segundo

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index: number) => {
            // Solo reintentar para ciertos tipos de errores
            if (index >= this.maxRetries || !this.shouldRetry(error)) {
              return throwError(() => error);
            }

            console.log(`Reintentando request (${index + 1}/${this.maxRetries}):`, req.url);
            
            // Esperar antes del siguiente intento
            return timer(this.retryDelay * (index + 1));
          })
        )
      )
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    // Solo reintentar para errores de red o errores del servidor 5xx
    return error.status >= 500 || error.status === 0;
  }
}