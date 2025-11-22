import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

interface Notification {
  idNotification: number;
  saleCode: string;
  customerName: string;
  total: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  notificationType: string;
}

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Solo cargar notificaciones si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      this.loadNotifications();
      // Actualizar cada 30 segundos
      setInterval(() => {
        if (this.authService.isAuthenticated()) {
          this.loadNotifications();
        }
      }, 30000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications(): void {
    // Verificar que hay token antes de hacer la petición
    if (!this.authService.isAuthenticated()) {
      console.log('⚠️ No hay token, no se cargan notificaciones');
      return;
    }

    this.http.get<Notification[]>(`${environment.urlBackEnd}/v1/api/notifications`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.filter(n => !n.isRead).length;
        },
        error: (error) => {
          // No mostrar error si es 401/403, ya que el interceptor maneja la redirección
          if (error.status !== 401 && error.status !== 403) {
            console.error('Error loading notifications:', error);
          }
        }
      });
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.http.put(`${environment.urlBackEnd}/v1/api/notifications/${notification.idNotification}/read`, {})
        .subscribe({
          next: () => {
            notification.isRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          },
          error: (error) => console.error('Error marking notification as read:', error)
        });
    }
  }

  markAllAsRead(): void {
    this.http.put(`${environment.urlBackEnd}/v1/api/notifications/read-all`, {})
      .subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.unreadCount = 0;
        },
        error: (error) => console.error('Error marking all as read:', error)
      });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'NEW_ORDER': return 'shopping_cart';
      case 'ORDER_COMPLETED': return 'check_circle';
      case 'ORDER_CANCELLED': return 'cancel';
      case 'LOW_STOCK': return 'warning';
      default: return 'notifications';
    }
  }

  getNotificationIconClass(type: string): string {
    switch (type) {
      case 'NEW_ORDER': return 'new-order';
      case 'ORDER_CANCELLED': return 'order-cancelled';
      case 'LOW_STOCK': return 'low-stock';
      default: return '';
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Hace un momento';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
    return `Hace ${Math.floor(seconds / 86400)} días`;
  }
}
