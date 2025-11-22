import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-type-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-type-selection.html',
  styleUrls: ['./user-type-selection.scss']
})
export class UserTypeSelectionComponent implements OnInit {
  
  isAuthenticated = false;
  currentUser: any = null;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    
    // Solo redirigir automáticamente si hay una URL de redirección guardada
    // (significa que viene de una ruta protegida)
    if (this.isAuthenticated && this.authService.getRedirectUrl()) {
      console.log('✅ Usuario ya autenticado con URL de redirección, redirigiendo al dashboard');
      const redirectUrl = this.authService.getRedirectUrl() || '/dashboard';
      this.authService.clearRedirectUrl();
      this.router.navigateByUrl(redirectUrl);
    }
    // Si no hay URL de redirección, mostrar la selección normalmente
  }
  
  navigateToCustomerLogin(): void {
    // Navegar al login de cliente (o directamente al portal)
    this.router.navigate(['/auth/customer-login']);
  }

  navigateToAdminLogin(): void {
    // Si ya está autenticado como admin, ir directo al dashboard
    if (this.isAuthenticated && this.authService.hasRole('ADMIN')) {
      this.router.navigate(['/dashboard']);
    } else {
      // Si no está autenticado, ir al login
      this.router.navigate(['/auth/login']);
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUser = null;
  }
}