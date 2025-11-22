import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

export interface OrderNotification {
  idNotification?: number;
  idSale: number;
  idCustomer: number;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt?: string;
}

// Servicio de UI para notificaciones toast/snackbar (usado por admin)
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  supplierDeactivated(name: string): void {
    this.success(`Proveedor "${name}" desactivado`);
  }

  supplierRestored(name: string): void {
    this.success(`Proveedor "${name}" reactivado`);
  }

  operationError(operation: string, entity: string, message?: string): void {
    this.error(`Error al ${operation} ${entity}: ${message || 'Error desconocido'}`);
  }

  stockUpdated(productName: string, newStock: number): void {
    this.success(`Stock actualizado: "${productName}" - Nuevo stock: ${newStock}`);
  }

  customerCreated(name: string): void {
    this.success(`Cliente "${name}" creado exitosamente`);
  }

  customerUpdated(name: string): void {
    this.success(`Cliente "${name}" actualizado exitosamente`);
  }

  customerDeleted(name: string): void {
    this.success(`Cliente "${name}" eliminado`);
  }

  customerRestored(name: string): void {
    this.success(`Cliente "${name}" restaurado`);
  }

  employeeCreated(name: string): void {
    this.success(`Empleado "${name}" creado exitosamente`);
  }

  employeeUpdated(name: string): void {
    this.success(`Empleado "${name}" actualizado exitosamente`);
  }

  employeeDeleted(name: string): void {
    this.success(`Empleado "${name}" eliminado`);
  }

  employeeRestored(name: string): void {
    this.success(`Empleado "${name}" restaurado`);
  }

  productCreated(name: string): void {
    this.success(`Producto "${name}" creado exitosamente`);
  }

  productUpdated(name: string): void {
    this.success(`Producto "${name}" actualizado exitosamente`);
  }

  productDeleted(name: string): void {
    this.success(`Producto "${name}" eliminado`);
  }

  productRestored(name: string): void {
    this.success(`Producto "${name}" restaurado`);
  }

  saleCreated(code: string): void {
    this.success(`Venta "${code}" creada exitosamente`);
  }

  saleUpdated(code: string): void {
    this.success(`Venta "${code}" actualizada exitosamente`);
  }

  saleDeleted(code: string): void {
    this.success(`Venta "${code}" eliminada`);
  }

  saleCancelled(code: string): void {
    this.success(`Venta "${code}" cancelada`);
  }

  storeItemCreated(name: string): void {
    this.success(`Item de almacén "${name}" creado exitosamente`);
  }

  storeItemUpdated(name: string): void {
    this.success(`Item de almacén "${name}" actualizado exitosamente`);
  }

  storeItemDeactivated(name: string): void {
    this.success(`Item de almacén "${name}" desactivado`);
  }

  storeItemRestored(name: string): void {
    this.success(`Item de almacén "${name}" restaurado`);
  }

  // Métodos adicionales
  warning(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 4000, panelClass: ['warning-snackbar'] });
  }

  validationError(message: string): void {
    this.error(`Error de validación: ${message}`);
  }

  operationSuccess(operation: string, entity: string): void {
    this.success(`${operation.charAt(0).toUpperCase() + operation.slice(1)} de ${entity} exitosa`);
  }

  noDataFound(entity: string): void {
    this.info(`No se encontraron ${entity}`);
  }

  customerDeactivated(name: string): void {
    this.success(`Cliente "${name}" desactivado`);
  }

  employeeDeactivated(name: string): void {
    this.success(`Empleado "${name}" desactivado`);
  }

  productDeactivated(name: string): void {
    this.success(`Producto "${name}" desactivado`);
  }

  saleRestored(code: string): void {
    this.success(`Venta "${code}" restaurada`);
  }
}

// Servicio para notificaciones de pedidos (usado por checkout)
@Injectable({
  providedIn: 'root'
})
export class OrderNotificationService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/notifications`;

  constructor(private http: HttpClient) { }

  // Crear notificación cuando se realiza una compra
  createOrderNotification(saleId: number, customerId: number, saleCode: string, total: number): Observable<any> {
    const notification: OrderNotification = {
      idSale: saleId,
      idCustomer: customerId,
      message: `Nueva compra realizada - ${saleCode} por S/ ${total.toFixed(2)}`,
      notificationType: 'NEW_ORDER',
      isRead: false
    };

    return this.http.post(this.apiUrl, notification);
  }

  // Obtener todas las notificaciones (para admin)
  getAllNotifications(): Observable<OrderNotification[]> {
    return this.http.get<OrderNotification[]>(this.apiUrl);
  }

  // Obtener notificaciones no leídas
  getUnreadNotifications(): Observable<OrderNotification[]> {
    return this.http.get<OrderNotification[]>(`${this.apiUrl}/unread`);
  }

  // Marcar notificación como leída
  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  // Marcar todas como leídas
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }

  // Eliminar notificación
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
