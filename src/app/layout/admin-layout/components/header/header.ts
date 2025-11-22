import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationBellComponent } from '../../../../shared/components/notification-bell/notification-bell.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NotificationBellComponent
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  @Input() sidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  
  user: any;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
    
    // VALIDAR QUE EL USUARIO SEA ADMIN O EMPLEADO
    const userRole = this.authService.getUserRole();
    console.log('👤 Usuario en admin-header:', this.user);
    console.log('👤 Rol del usuario:', userRole);
    
    // Solo validar si HAY un usuario logueado y ES cliente
    // Si no hay usuario, el RoleGuard se encargará de redirigir
    if (userRole && userRole === 'CLIENTE') {
      console.log('❌ Usuario CLIENTE intentando acceder al panel de admin');
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
    
    // Si no hay usuario en absoluto, no hacer nada (el guard redirigirá)
    if (!this.user) {
      console.log('⚠️ No hay usuario logueado en admin, esperando guard...');
    }
  }

  onToggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    // El authService ya redirige al login correcto según el contexto
  }
}