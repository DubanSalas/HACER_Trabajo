import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../interfaces/customer-portal-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private deliveryFee = 5.00;

  constructor() {
    this.loadCartFromStorage();
  }

  get items$(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  get items(): CartItem[] {
    return this.cartItems.value;
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  get subtotal(): number {
    return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get deliveryFeeAmount(): number {
    return this.deliveryFee;
  }

  addProduct(product: Product, quantity: number = 1, notes?: string): void {
    const currentItems = this.items;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += quantity;
      if (notes) {
        currentItems[existingItemIndex].notes = notes;
      }
    } else {
      currentItems.push({
        product,
        quantity,
        notes
      });
    }

    this.updateCart(currentItems);
  }

  removeProduct(productId: string): void {
    const currentItems = this.items.filter(item => item.product.id !== productId);
    this.updateCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    const currentItems = this.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    );

    this.updateCart(currentItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    this.saveCartToStorage(items);
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('customer_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItems.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem('customer_cart', JSON.stringify(items));
  }
}