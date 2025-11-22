import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Order, OrderStatus } from '../../../core/interfaces/customer-portal-interfaces';
import { CustomerOrdersService } from '../../../core/services/customer-orders.service';
import { CartService } from '../../../core/services/cart.service';
import { CustomerService } from '../../../core/services/customer.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './customer-orders.html',
  styleUrls: ['./customer-orders.scss']
})
export class CustomerOrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allOrders: Order[] = [];
  activeOrders: Order[] = [];
  completedOrders: Order[] = [];
  isLoading = true;

  constructor(
    private ordersService: CustomerOrdersService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrders(): void {
    this.isLoading = true;

    // Obtener el ID del cliente actual
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.username) {
      this.isLoading = false;
      this.snackBar.open('No se pudo obtener la información del usuario', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Primero obtener los datos del cliente para tener el ID
    this.customerService.getCustomerByEmail(currentUser.username).subscribe({
      next: (customer) => {
        console.log('📋 Datos del cliente:', customer);
        console.log('📋 ID del cliente:', customer.idCustomer);
        
        // Cargar los pedidos del cliente
        this.customerService.getMyOrders(customer.idCustomer).subscribe({
          next: (orders) => {
            console.log('✅ Pedidos cargados desde backend:', orders);
            console.log('✅ Cantidad de pedidos:', orders.length);
            this.allOrders = this.mapOrdersFromBackend(orders);
            this.filterOrders();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ Error al cargar pedidos:', error);
            this.allOrders = [];
            this.filterOrders();
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error al obtener datos del cliente:', error);
        this.isLoading = false;
      }
    });
  }

  private mapOrdersFromBackend(backendOrders: any[]): Order[] {
    return backendOrders.map(order => ({
      id: order.orderCode,
      orderNumber: order.orderCode,
      customerId: order.idSale.toString(),
      customerName: '',
      items: [], // Se cargarán al ver el detalle
      status: this.mapBackendStatus(order.status),
      total: order.total,
      subtotal: order.total,
      deliveryFee: 5.00,
      discount: 0,
      paymentMethod: order.paymentMethod,
      deliveryAddress: '',
      customerPhone: '',
      specialInstructions: '',
      orderDate: new Date(order.saleDate),
      estimatedDelivery: new Date(order.saleDate)
    }));
  }

  private mapBackendStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'Pendiente': OrderStatus.PENDING,
      'Confirmado': OrderStatus.CONFIRMED,
      'Preparando': OrderStatus.PREPARING,
      'En camino': OrderStatus.ON_WAY,
      'Completado': OrderStatus.DELIVERED,
      'Cancelado': OrderStatus.CANCELLED
    };
    return statusMap[status] || OrderStatus.PENDING;
  }

  private filterOrders(): void {
    this.activeOrders = this.allOrders.filter(order =>
      [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.ON_WAY].includes(order.status)
    );

    this.completedOrders = this.allOrders.filter(order =>
      [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
    );
  }

  getStatusText(status: OrderStatus): string {
    return this.ordersService.getOrderStatusText(status);
  }

  getStatusColor(status: OrderStatus): string {
    return this.ordersService.getOrderStatusColor(status);
  }

  getStatusIcon(status: OrderStatus): string {
    const iconMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'schedule',
      [OrderStatus.CONFIRMED]: 'check_circle',
      [OrderStatus.PREPARING]: 'restaurant',
      [OrderStatus.ON_WAY]: 'delivery_dining',
      [OrderStatus.DELIVERED]: 'done_all',
      [OrderStatus.CANCELLED]: 'cancel'
    };
    return iconMap[status] || 'help';
  }

  reorderItems(order: Order): void {
    order.items.forEach(item => {
      this.cartService.addProduct(item.product, item.quantity);
    });

    this.snackBar.open(
      `${order.items.length} productos agregados al carrito`,
      'Ver Carrito',
      { duration: 3000 }
    ).onAction().subscribe(() => {
      // Navigate to cart
    });
  }

  cancelOrder(order: Order): void {
    // Simular cancelación
    order.status = OrderStatus.CANCELLED;
    this.filterOrders();

    this.snackBar.open('Pedido cancelado exitosamente', 'Cerrar', {
      duration: 3000
    });
  }

  canCancelOrder(order: Order): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status);
  }

  private getMockOrders(): Order[] {
    const now = new Date();

    return [
      {
        id: 'ORD-001',
        orderNumber: 'ORD-001',
        customerId: 'customer-demo',
        customerName: 'Juan Pérez',
        items: [
          {
            product: {
              id: '1',
              name: 'Pizza Margherita Especial',
              description: 'Pizza artesanal con mozzarella fresca',
              price: 24.90,
              image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
              category: 'Pizza',
              isAvailable: true,
              rating: 4.8,
              reviews: 156
            },
            id: '1',
            quantity: 1,
            price: 24.90
          },
          {
            product: {
              id: '6',
              name: 'Coca Cola 500ml',
              description: 'Bebida gaseosa refrescante',
              price: 3.50,
              image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
              category: 'Bebidas',
              isAvailable: true,
              rating: 4.2,
              reviews: 45
            },
            id: '2',
            quantity: 2,
            price: 3.50
          }
        ],
        status: OrderStatus.ON_WAY,
        total: 31.90,
        subtotal: 31.90,
        deliveryFee: 5.00,
        discount: 0,
        paymentMethod: 'Tarjeta de Crédito',
        deliveryAddress: 'Av. Larco 123, Miraflores',
        customerPhone: '987654321',
        specialInstructions: 'Pedido realizado desde la app web',
        orderDate: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
        estimatedDelivery: new Date(now.getTime() + 15 * 60 * 1000) // 15 min from now
      },
      {
        id: 'ORD-002',
        orderNumber: 'ORD-002',
        customerId: 'customer-demo',
        customerName: 'Juan Pérez',
        items: [
          {
            product: {
              id: '2',
              name: 'Hamburguesa Gourmet',
              description: 'Carne angus, queso cheddar, bacon',
              price: 18.50,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              category: 'Hamburguesas',
              isAvailable: true,
              rating: 4.6,
              reviews: 89
            },
            id: '3',
            quantity: 2,
            price: 18.50
          }
        ],
        status: OrderStatus.DELIVERED,
        total: 42.00,
        subtotal: 37.00,
        deliveryFee: 5.00,
        discount: 0,
        paymentMethod: 'Yape',
        deliveryAddress: 'Av. Larco 123, Miraflores',
        customerPhone: '987654321',
        specialInstructions: 'Pedido realizado desde la app web',
        orderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        estimatedDelivery: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000)
      },
      {
        id: 'ORD-003',
        orderNumber: 'ORD-003',
        customerId: 'customer-demo',
        customerName: 'Juan Pérez',
        items: [
          {
            product: {
              id: '3',
              name: 'Pollo a la Parrilla',
              description: 'Pechuga de pollo marinada',
              price: 16.90,
              image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
              category: 'Pollo',
              isAvailable: true,
              rating: 4.7,
              reviews: 124
            },
            id: '4',
            quantity: 1,
            price: 16.90
          }
        ],
        status: OrderStatus.PREPARING,
        total: 21.90,
        subtotal: 16.90,
        deliveryFee: 5.00,
        discount: 0,
        paymentMethod: 'Efectivo',
        deliveryAddress: 'Av. Larco 123, Miraflores',
        customerPhone: '987654321',
        specialInstructions: 'Pedido realizado desde la app web',
        orderDate: new Date(now.getTime() - 15 * 60 * 1000), // 15 min ago
        estimatedDelivery: new Date(now.getTime() + 30 * 60 * 1000) // 30 min from now
      }
    ];
  }
}