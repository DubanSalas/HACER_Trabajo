import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { CustomerOrdersService } from '../../../core/services/customer-orders.service';
import { OrderNotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartItem } from '../../../core/interfaces/customer-portal-interfaces';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cartItems: CartItem[] = [];
  subtotal = 0;
  deliveryFee = 0;
  total = 0;
  isProcessing = false;

  // Forms
  deliveryForm: FormGroup;
  paymentForm: FormGroup;

  // Payment methods
  paymentMethods = [
    { value: 'card', label: 'Tarjeta de Crédito/Débito', icon: 'credit_card' },
    { value: 'yape', label: 'Yape', icon: 'phone_android' },
    { value: 'plin', label: 'Plin', icon: 'account_balance_wallet' },
    { value: 'cash', label: 'Efectivo (Contra entrega)', icon: 'payments' }
  ];

  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private ordersService: CustomerOrdersService,
    private orderNotificationService: OrderNotificationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      reference: [''],
      district: ['', Validators.required],
      notes: ['']
    });

    this.paymentForm = this.fb.group({
      method: ['card', Validators.required],
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCvv: [''],
      yapePhone: [''],
      plinPhone: ['']
    });
  }

  ngOnInit(): void {
    this.loadCartData();
    this.setupPaymentMethodValidation();
    
    // Obtener usuario actual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartData(): void {
    this.cartService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.subtotal = this.cartService.subtotal;
        this.deliveryFee = this.cartService.deliveryFeeAmount;
        this.total = this.cartService.total;

        if (items.length === 0) {
          this.router.navigate(['/customer/cart']);
        }
      });
  }

  private setupPaymentMethodValidation(): void {
    this.paymentForm.get('method')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(method => {
        this.clearPaymentValidators();

        switch (method) {
          case 'card':
            this.setCardValidators();
            break;
          case 'yape':
            this.setYapeValidators();
            break;
          case 'plin':
            this.setPlinValidators();
            break;
        }
      });
  }

  private clearPaymentValidators(): void {
    const fields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv', 'yapePhone', 'plinPhone'];
    fields.forEach(field => {
      this.paymentForm.get(field)?.clearValidators();
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
  }

  private setCardValidators(): void {
    this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
    this.paymentForm.get('cardName')?.setValidators([Validators.required, Validators.minLength(2)]);
    this.paymentForm.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]);
    this.paymentForm.get('cardCvv')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
    this.updateValidators(['cardNumber', 'cardName', 'cardExpiry', 'cardCvv']);
  }

  private setYapeValidators(): void {
    this.paymentForm.get('yapePhone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    this.updateValidators(['yapePhone']);
  }

  private setPlinValidators(): void {
    this.paymentForm.get('plinPhone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    this.updateValidators(['plinPhone']);
  }

  private updateValidators(fields: string[]): void {
    fields.forEach(field => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
  }

  async processOrder(): Promise<void> {
    if (this.deliveryForm.invalid || this.paymentForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isProcessing = true;

    try {
      // Simular procesamiento de pago
      await this.simulatePaymentProcessing();

      // Crear la orden
      const orderData = {
        customerId: 'customer-demo',
        customerName: this.deliveryForm.value.fullName,
        cartItems: this.cartItems,
        subtotal: this.subtotal,
        deliveryFee: this.deliveryFee,
        discount: 0,
        total: this.total,
        paymentMethod: this.getPaymentMethodLabel(),
        deliveryAddress: this.getFullAddress(),
        customerPhone: this.deliveryForm.value.phone,
        specialInstructions: this.deliveryForm.value.notes || 'Pedido realizado desde la app web'
      };

      // Crear orden en el backend
      const saleId = Math.floor(Math.random() * 1000) + 1; // Temporal, debería venir del backend
      const saleCode = `V${String(saleId).padStart(3, '0')}`;

      // Crear notificación para el administrador
      if (this.currentUser && this.currentUser.id) {
        this.orderNotificationService.createOrderNotification(
          saleId,
          this.currentUser.id,
          saleCode,
          this.total
        ).subscribe({
          next: () => {
            console.log('✅ Notificación enviada al administrador');
          },
          error: (error: any) => {
            console.error('❌ Error al enviar notificación:', error);
            // No bloqueamos el proceso si falla la notificación
          }
        });
      }

      // Limpiar carrito
      this.cartService.clearCart();

      const orderId = saleCode;

      // Navegar a confirmación
      this.router.navigate(['/customer/order-confirmation'], {
        queryParams: { orderId, total: this.total }
      });

    } catch (error) {
      this.snackBar.open('Error al procesar el pago. Inténtalo nuevamente.', 'Cerrar', {
        duration: 5000
      });
    } finally {
      this.isProcessing = false;
    }
  }

  private async simulatePaymentProcessing(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.paymentForm.value.method);
    return method?.label || 'Método de pago';
  }

  getFullAddress(): string {
    const form = this.deliveryForm.value;
    return `${form.address}, ${form.district}${form.reference ? ' - ' + form.reference : ''}`;
  }

  goBackToCart(): void {
    this.router.navigate(['/customer/cart']);
  }
}