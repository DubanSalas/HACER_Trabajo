import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRoles = this.authService.getUserRoles();
    
    if (!userRoles || userRoles.length === 0) {
      this.notificationService.error('No tiene permisos para acceder a esta página');
      this.router.navigate(['/dashboard']);
      return false;
    }

    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      this.notificationService.error('No tiene permisos suficientes para acceder a esta página');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}