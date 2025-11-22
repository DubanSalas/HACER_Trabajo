import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { CartItem } from '../../../core/interfaces/customer-portal-interfaces';

@Component({
  selector: 'app-customer-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './customer-checkout.html',
  styleUrls: ['./customer-checkout.scss']
})
export class CustomerCheckoutComponent implements OnInit {
  deliveryForm!: FormGroup;
  paymentForm!: FormGroup;
  
  cartItems: CartItem[] = [];
  subtotal = 0;
  deliveryFee = 0;
  total = 0;
  
  isLoading = false;
  isProcessing = false;
  customerData: any = null;

  // Datos de ubicación
  departments: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  isLoadingLocation = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadCartData();
    this.loadDepartments();
    this.loadCustomerData();
  }

  private initForms(): void {
    this.deliveryForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      department: ['', Validators.required],
      province: [{ value: '', disabled: true }, Validators.required],
      district: [{ value: '', disabled: true }, Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      reference: [''],
      notes: ['']
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['Efectivo', Validators.required],
      changeFor: ['']
    });
  }

  private loadCartData(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.subtotal = this.cartService.subtotal;
      this.deliveryFee = this.cartService.deliveryFeeAmount;
      this.total = this.cartService.total;
    });
  }

  private loadCustomerData(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.username) {
      this.customerService.getCustomerByEmail(currentUser.username).subscribe({
        next: (customer) => {
          this.customerData = customer;
          this.prefillDeliveryForm(customer);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading customer data:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private prefillDeliveryForm(customer: any): void {
    this.deliveryForm.patchValue({
      fullName: `${customer.name} ${customer.surname}`,
      phone: customer.phone || '',
      department: customer.department || '',
      province: customer.province || '',
      district: customer.district || '',
      address: customer.locationAddress || ''
    });

    // Cargar provincias y distritos si hay departamento pre-llenado
    if (customer.department) {
      this.onDepartmentChange(customer.department, customer.province, customer.district);
    }
  }

  private loadDepartments(): void {
    this.isLoadingLocation = true;
    this.customerService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoadingLocation = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoadingLocation = false;
      }
    });
  }

  onDepartmentChange(departmentName?: string, preselectedProvince?: string, preselectedDistrict?: string): void {
    const department = departmentName || this.deliveryForm.get('department')?.value;
    
    if (!department) {
      this.provinces = [];
      this.districts = [];
      this.deliveryForm.get('province')?.disable();
      this.deliveryForm.get('district')?.disable();
      return;
    }

    this.isLoadingLocation = true;
    this.deliveryForm.get('province')?.disable();
    this.deliveryForm.get('district')?.disable();
    
    this.customerService.getProvincesByDepartment(department).subscribe({
      next: (data) => {
        this.provinces = data;
        this.deliveryForm.get('province')?.enable();
        this.isLoadingLocation = false;

        // Si hay provincia pre-seleccionada, cargar sus distritos
        if (preselectedProvince) {
          this.deliveryForm.patchValue({ province: preselectedProvince });
          this.onProvinceChange(preselectedProvince, preselectedDistrict);
        }
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
        this.deliveryForm.get('province')?.enable();
        this.isLoadingLocation = false;
      }
    });
  }

  onProvinceChange(provinceName?: string, preselectedDistrict?: string): void {
    const province = provinceName || this.deliveryForm.get('province')?.value;
    const department = this.deliveryForm.get('department')?.value;
    
    if (!province || !department) {
      this.districts = [];
      this.deliveryForm.get('district')?.disable();
      return;
    }

    this.isLoadingLocation = true;
    this.deliveryForm.get('district')?.disable();
    
    this.customerService.getDistrictsByProvince(department, province).subscribe({
      next: (data) => {
        this.districts = data;
        this.deliveryForm.get('district')?.enable();
        this.isLoadingLocation = false;

        // Si hay distrito pre-seleccionado, establecerlo
        if (preselectedDistrict) {
          this.deliveryForm.patchValue({ district: preselectedDistrict });
        }
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.deliveryForm.get('district')?.enable();
        this.isLoadingLocation = false;
      }
    });
  }

  onPaymentMethodChange(): void {
    const paymentMethod = this.paymentForm.get('paymentMethod')?.value;
    const changeForControl = this.paymentForm.get('changeFor');
    
    if (paymentMethod === 'Efectivo') {
      changeForControl?.setValidators([Validators.required, Validators.min(this.total)]);
    } else {
      changeForControl?.clearValidators();
      changeForControl?.setValue('');
    }
    changeForControl?.updateValueAndValidity();
  }

  onConfirmOrder(): void {
    if (this.deliveryForm.invalid || this.paymentForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.cartItems.length === 0) {
      this.snackBar.open('Tu carrito está vacío', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isProcessing = true;

    const orderData = {
      customer: {
        idCustomer: this.customerData?.idCustomer,
        email: this.customerData?.email,
        name: this.deliveryForm.value.fullName
      },
      delivery: this.deliveryForm.value,
      payment: this.paymentForm.value,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
        notes: item.notes
      })),
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee,
      total: this.total,
      orderDate: new Date()
    };

    console.log('📦 Orden a procesar:', orderData);

    // Llamar al servicio de backend para crear el pedido
    this.customerService.createOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('✅ Pedido creado:', response);
        this.cartService.clearCart();
        this.isProcessing = false;
        
        this.snackBar.open('¡Pedido realizado con éxito! 🎉', 'Cerrar', {
          duration: 5000
        });
        
        // Redirigir a la página de confirmación con el código del pedido
        this.router.navigate(['/customer/order-confirmation'], {
          queryParams: { orderCode: response.orderCode }
        });
      },
      error: (error) => {
        console.error('❌ Error al crear pedido:', error);
        this.isProcessing = false;
        this.snackBar.open('Error al procesar el pedido. Intenta nuevamente.', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  getChange(): number {
    const changeFor = this.paymentForm.get('changeFor')?.value;
    return changeFor ? changeFor - this.total : 0;
  }
}
