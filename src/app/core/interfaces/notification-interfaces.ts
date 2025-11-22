// DTO que viene del backend
export interface OrderNotificationDTO {
  idNotification: number;
  idSale: number;
  saleCode: string;
  customerName: string;
  total: number;
  notificationType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// Interface para uso interno del frontend
export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  priority: NotificationPriority;
}

export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  LOW_STOCK = 'LOW_STOCK',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  CUSTOMER_FEEDBACK = 'CUSTOMER_FEEDBACK'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}