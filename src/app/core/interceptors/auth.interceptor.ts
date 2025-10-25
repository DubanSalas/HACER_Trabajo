import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Temporalmente deshabilitar el interceptor para probar sin autenticación
  console.log('🔄 Interceptor bypassed for:', req.method, req.url);
  return next(req);
};