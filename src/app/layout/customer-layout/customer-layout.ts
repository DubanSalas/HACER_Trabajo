import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './customer-layout.html',
  styleUrls: ['./customer-layout.scss']
})
export class CustomerLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cartItemCount = 0;
  currentUser: any = null;
  customerData: any = null;

  menuItems = [
    { icon: 'home', label: 'Inicio', route: '/customer/home' },
    { icon: 'restaurant_menu', label: 'Menú', route: '/customer/menu' },
    { icon: 'shopping_cart', label: 'Mi Carrito', route: '/customer/cart' },
    { icon: 'receipt_long', label: 'Mis Pedidos', route: '/customer/orders' },
    { icon: 'person', label: 'Mi Perfil', route: '/customer/profile' }
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // VALIDAR QUE EL USUARIO SEA CLIENTE
    this.currentUser = this.authService.getCurrentUser();
    const userRole = this.authService.getUserRole();
    
    console.log('👤 Usuario en customer-layout:', this.currentUser);
    console.log('👤 Rol del usuario:', userRole);
    
    // Solo validar si HAY un usuario logueado y NO es cliente
    // Si no hay usuario, el RoleGuard se encargará de redirigir
    if (userRole && userRole !== 'CLIENTE') {
      console.log('❌ Usuario no es CLIENTE, redirigiendo al login de cliente');
      this.authService.logout();
      this.router.navigate(['/customer/login']);
      return;
    }
    
    // Si no hay usuario en absoluto, no hacer nada (el guard redirigirá)
    if (!this.currentUser) {
      console.log('⚠️ No hay usuario logueado, esperando guard...');
      return;
    }
    
    this.cartService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItemCount = this.cartService.itemCount;
      });

    // Cargar datos completos del cliente
    if (this.currentUser && this.currentUser.username) {
      const email = this.currentUser.username;
      console.log('📧 Cargando datos del cliente:', email);
      
      this.customerService.getCustomerByEmail(email).subscribe({
        next: (customer) => {
          console.log('✅ Datos del cliente cargados en layout:', customer);
          this.customerData = customer;
          // Actualizar currentUser con el nombre completo
          this.currentUser = {
            ...this.currentUser,
            name: `${customer.name} ${customer.surname}`,
            fullName: `${customer.name} ${customer.surname}`,
            firstName: customer.name,
            lastName: customer.surname,
            email: customer.email
          };
        },
        error: (error) => {
          console.error('❌ Error cargando datos del cliente:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    // El authService ya redirige al login correcto según el contexto
  }

  navigateToCart(): void {
    this.router.navigate(['/customer/cart']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/customer/profile']);
  }

  getInitials(): string {
    if (this.customerData) {
      const name = this.customerData.name || '';
      const surname = this.customerData.surname || '';
      return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
    return 'CL';
  }

  getDisplayName(): string {
    if (this.customerData) {
      return `${this.customerData.name} ${this.customerData.surname}`;
    }
    return this.currentUser?.name || 'Cliente';
  }
}