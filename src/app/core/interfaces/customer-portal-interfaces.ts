export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  paymentMethod: string;
  deliveryAddress: string;
  customerPhone: string;
  specialInstructions?: string;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingHistory?: TrackingEvent[];
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  ON_WAY = 'ON_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: Date;
  description: string;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  lastOrderDate?: Date;
}