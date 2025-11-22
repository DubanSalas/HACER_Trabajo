import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { Order, OrderStatus, TrackingEvent } from '../../../core/interfaces/customer-portal-interfaces';
import { CustomerOrdersService } from '../../../core/services/customer-orders.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatMenuModule
  ],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  order: Order | null = null;
  orderId: string = '';
  isLoading = true;

  // Order tracking steps
  trackingSteps = [
    { label: 'Pedido Confirmado', icon: 'check_circle', status: 'CONFIRMED' },
    { label: 'Preparando', icon: 'restaurant', status: 'PREPARING' },
    { label: 'En Camino', icon: 'delivery_dining', status: 'ON_WAY' },
    { label: 'Entregado', icon: 'done_all', status: 'DELIVERED' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: CustomerOrdersService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.orderId = params['id'];
        this.loadOrderDetail();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrderDetail(): void {
    this.isLoading = true;

    // Simular carga de detalle de orden (aquí conectarías con la API real)
    setTimeout(() => {
      this.order = this.getMockOrderDetail(this.orderId);
      this.isLoading = false;
    }, 1000);
  }

  private getMockOrderDetail(orderId: string): Order {
    return {
      id: orderId,
      orderNumber: `ORD-${orderId.slice(-6).toUpperCase()}`,
      customerId: 'customer-demo',
      customerName: 'Juan Pérez',
      customerPhone: '987654321',
      status: OrderStatus.ON_WAY,
      orderDate: new Date('2024-10-28T14:30:00'),
      estimatedDelivery: new Date('2024-10-28T15:45:00'),
      actualDelivery: undefined,
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Pizza Margherita Especial',
            description: 'Pizza artesanal con mozzarella fresca, tomate y albahaca',
            price: 24.90,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            category: 'Pizza',
            isAvailable: true,
            rating: 4.8,
            reviews: 156
          },
          quantity: 2,
          price: 24.90,
          notes: 'Sin cebolla, extra queso'
        },
        {
          id: '2',
          product: {
            id: '2',
            name: 'Hamburguesa Gourmet',
            description: 'Carne angus, queso cheddar, bacon y vegetales frescos',
            price: 18.50,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            category: 'Hamburguesas',
            isAvailable: true,
            rating: 4.6,
            reviews: 89
          },
          quantity: 1,
          price: 18.50,
          notes: ''
        },
        {
          id: '3',
          product: {
            id: '3',
            name: 'Coca Cola 500ml',
            description: 'Bebida gaseosa refrescante',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
            category: 'Bebidas',
            isAvailable: true,
            rating: 4.2,
            reviews: 45
          },
          quantity: 3,
          price: 3.50,
          notes: ''
        }
      ],
      subtotal: 78.30,
      deliveryFee: 5.00,
      discount: 0,
      total: 83.30,
      paymentMethod: 'Tarjeta de Crédito/Débito',
      deliveryAddress: 'Av. Larco 123, Dpto 4B, Miraflores - Referencia: Edificio azul',
      specialInstructions: 'Tocar el timbre 2 veces. Departamento 4B',
      trackingHistory: [
        {
          status: OrderStatus.CONFIRMED,
          timestamp: new Date('2024-10-28T14:30:00'),
          description: 'Pedido confirmado y enviado a cocina'
        },
        {
          status: OrderStatus.PREPARING,
          timestamp: new Date('2024-10-28T14:45:00'),
          description: 'Tu pedido está siendo preparado'
        },
        {
          status: OrderStatus.ON_WAY,
          timestamp: new Date('2024-10-28T15:15:00'),
          description: 'El repartidor está en camino'
        }
      ]
    };
  }

  getStatusLabel(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.PREPARING]: 'Preparando',
      [OrderStatus.ON_WAY]: 'En Camino',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: OrderStatus): string {
    const colorMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'warn',
      [OrderStatus.CONFIRMED]: 'primary',
      [OrderStatus.PREPARING]: 'accent',
      [OrderStatus.ON_WAY]: 'primary',
      [OrderStatus.DELIVERED]: 'primary',
      [OrderStatus.CANCELLED]: 'warn'
    };
    return colorMap[status] || 'primary';
  }

  getStepIndex(status: OrderStatus): number {
    return this.trackingSteps.findIndex(step => step.status === status);
  }

  getCurrentStepIndex(): number {
    if (!this.order) return 0;
    return this.getStepIndex(this.order.status);
  }

  isStepCompleted(stepIndex: number): boolean {
    return stepIndex <= this.getCurrentStepIndex();
  }

  canCancelOrder(): boolean {
    if (!this.order) return false;
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.order.status);
  }

  canReorder(): boolean {
    if (!this.order) return false;
    return this.order.status === OrderStatus.DELIVERED;
  }

  cancelOrder(): void {
    if (!this.order || !this.canCancelOrder()) return;

    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      // Aquí conectarías con la API para cancelar
      this.snackBar.open('Pedido cancelado exitosamente', 'Cerrar', {
        duration: 3000
      });

      // Actualizar estado local
      this.order.status = OrderStatus.CANCELLED;
    }
  }

  reorderItems(): void {
    if (!this.order || !this.canReorder()) return;

    // Agregar todos los items al carrito
    this.order.items.forEach(item => {
      this.cartService.addProduct(item.product, item.quantity);
    });

    this.snackBar.open('Productos agregados al carrito', 'Ver Carrito', {
      duration: 5000
    }).onAction().subscribe(() => {
      this.router.navigate(['/customer/cart']);
    });
  }

  goBack(): void {
    this.router.navigate(['/customer/orders']);
  }

  contactSupport(): void {
    // Aquí podrías abrir un chat de soporte o redirigir a WhatsApp
    this.snackBar.open('Contactando con soporte...', 'Cerrar', {
      duration: 3000
    });
  }

  shareOrder(): void {
    if (navigator.share) {
      navigator.share({
        title: `Pedido ${this.order?.orderNumber}`,
        text: `Mi pedido de DeliPedidos por S/${this.order?.total.toFixed(2)}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      this.snackBar.open('Enlace copiado al portapapeles', 'Cerrar', {
        duration: 3000
      });
    }
  }
}