import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CartItem } from '../../../core/interfaces/customer-portal-interfaces';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-customer-cart',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './customer-cart.html',
  styleUrls: ['./customer-cart.scss']
})
export class CustomerCartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cartItems: CartItem[] = [];
  subtotal = 0;
  deliveryFee = 0;
  total = 0;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cartService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.updateTotals();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTotals(): void {
    this.subtotal = this.cartService.subtotal;
    this.deliveryFee = this.cartService.deliveryFeeAmount;
    this.total = this.cartService.total;
  }

  increaseQuantity(productId: string): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: string): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeProduct(productId);
    this.snackBar.open('Producto eliminado del carrito', 'Cerrar', {
      duration: 3000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Carrito vaciado', 'Cerrar', {
      duration: 3000
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Tu carrito está vacío', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    // Navigation to checkout will be handled by router
  }
}