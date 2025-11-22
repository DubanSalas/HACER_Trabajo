import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('🔒 AuthGuard - Verificando autenticación para:', state.url);
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ AuthGuard - Usuario autenticado, permitiendo acceso');
      return true;
    }
    
    console.log('❌ AuthGuard - Usuario NO autenticado, redirigiendo al login');
    console.log('🔒 AuthGuard - Guardando URL de redirección:', state.url);
    
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    this.authService.setRedirectUrl(state.url);
    
    // Redirigir al login
    return this.router.createUrlTree(['/login']);
  }
}
