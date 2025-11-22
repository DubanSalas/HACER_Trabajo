import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order, OrderStatus, CartItem } from '../interfaces/customer-portal-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrdersService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/customer/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor(private http: HttpClient) {}

  get orders$(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  loadCustomerOrders(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${customerId}`);
  }

  createOrder(orderData: {
    customerId: string;
    customerName: string;
    cartItems: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    deliveryAddress: string;
    customerPhone: string;
    specialInstructions?: string;
  }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/detail/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  reorderItems(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/reorder`, {});
  }

  getOrderStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.PREPARING]: 'Preparando',
      [OrderStatus.ON_WAY]: 'En camino',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getOrderStatusColor(status: OrderStatus): string {
    const colorMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'warning',
      [OrderStatus.CONFIRMED]: 'info',
      [OrderStatus.PREPARING]: 'primary',
      [OrderStatus.ON_WAY]: 'accent',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELLED]: 'warn'
    };
    return colorMap[status] || 'primary';
  }
}