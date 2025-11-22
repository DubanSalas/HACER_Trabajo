import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SalesService } from '../../../core/services/sales.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductsService } from '../../../core/services/products.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './sales-form.html',
  styleUrls: ['./sales-form.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SalesFormComponent implements OnInit {
  saleForm: FormGroup;
  isEditMode = false;
  saleId: number | null = null;
  loading = false;
  private _submitting = false;
  generatingCode = false;
  selectedCustomerName = '';  // Para mostrar el nombre del cliente en modo edición
  savedCustomerId: number | null = null;  // Para guardar el ID del cliente en modo edición

  get submitting(): boolean {
    return this._submitting;
  }

  set submitting(value: boolean) {
    this._submitting = value;
  }

  customers: any[] = [];
  products: any[] = [];
  employees: any[] = [];
  generatedSaleCode: string = '';

  paymentMethods = [
    'Efectivo',
    'Tarjeta',
    'Transferencia',
    'Yape',
    'Plin'
  ];

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private customerService: CustomerService,
    private productsService: ProductsService,
    private employeesService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.saleForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.saleId = +params['id'];
        this.loadSale();
      } else {
        // En modo creación, asegurar que loading sea false
        this.loading = false;
        // Generar código de venta automáticamente
        this.generateSaleCode();
        // Agregar un detalle por defecto
        this.addDetail();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      saleCode: [{ value: '', disabled: true }, Validators.required],
      customerId: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      saleDate: [{ value: new Date().toISOString().split('T')[0], disabled: true }, Validators.required],
      notes: [''], // Campo opcional
      details: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  // Método para deshabilitar campos en modo edición
  private disableFieldsInEditMode(): void {
    if (this.isEditMode) {
      // Deshabilitar solo el cliente (no se puede cambiar)
      this.saleForm.get('customerId')?.disable();
      // El empleado SÍ se puede cambiar en edición
      // La fecha tampoco se puede cambiar
      this.saleForm.get('saleDate')?.disable();
      // El código de venta ya está deshabilitado por defecto
    }
  }

  get details(): FormArray {
    return this.saleForm.get('details') as FormArray;
  }

  loadInitialData(): void {
    // Load customers
    this.customerService.getAll().subscribe({
      next: (customers: any[]) => {
        console.log('All customers loaded:', customers);
        this.customers = customers.filter(c => c.status === 'A');
        console.log('Active customers:', this.customers);
        if (this.customers.length === 0) {
          console.warn('No active customers found!');
          this.notificationService.warning('No hay clientes activos disponibles');
        }
      },
      error: (error: any) => console.error('Error loading customers:', error)
    });

    // Load employees
    this.employeesService.getAll().subscribe({
      next: (employees: any[]) => {
        console.log('All employees loaded:', employees);
        this.employees = employees.filter(e => e.status === 'A');
        console.log('Active employees:', this.employees);
        if (this.employees.length === 0) {
          console.warn('No active employees found!');
          this.notificationService.warning('No hay empleados activos disponibles');
        } else {
          // Si hay empleados, seleccionar el primero por defecto
          this.saleForm.patchValue({
            employeeId: this.employees[0].idEmployee
          });
          console.log('Default employee selected:', this.employees[0]);
        }
      },
      error: (error: any) => console.error('Error loading employees:', error)
    });

    // Load products
    this.productsService.getAll().subscribe({
      next: (products: any[]) => {
        console.log('All products loaded:', products);
        this.products = products.filter(p => p.status === 'A' && p.stock > 0);
        console.log('Available products:', this.products);
        if (this.products.length === 0) {
          console.warn('No products with stock available!');
          this.notificationService.warning('No hay productos con stock disponibles');
        }
      },
      error: (error: any) => console.error('Error loading products:', error)
    });
  }

  loadSale(): void {
    if (!this.saleId) return;

    this.loading = true;
    this.salesService.getById(this.saleId).subscribe({
      next: (sale: any) => {
        // Guardar el customerId antes de deshabilitar el campo
        this.savedCustomerId = sale.customer?.idCustomer || sale.customerId;

        this.saleForm.patchValue({
          saleCode: sale.saleCode,
          customerId: this.savedCustomerId,
          employeeId: sale.employee?.idEmployee,
          paymentMethod: sale.paymentMethod,
          saleDate: sale.saleDate,
          notes: sale.notes
        });

        this.generatedSaleCode = sale.saleCode;

        // Guardar el nombre completo del cliente para mostrarlo en modo edición
        console.log('Sale customer data:', sale.customer);
        console.log('Saved customer ID:', this.savedCustomerId);
        if (sale.customer) {
          this.selectedCustomerName = `${sale.customer.name} ${sale.customer.surname} - ${sale.customer.clientCode}`;
          console.log('Selected customer name:', this.selectedCustomerName);
        } else {
          // Si no viene el objeto customer, intentar con customerFullName
          this.selectedCustomerName = sale.customerFullName || 'Cliente no disponible';
          console.log('Using customerFullName:', this.selectedCustomerName);
        }

        // Load sale details
        if (sale.details && sale.details.length > 0) {
          sale.details.forEach((detail: any) => {
            this.addDetail(detail);
          });
        }

        // Deshabilitar campos que no deben modificarse en edición
        this.disableFieldsInEditMode();

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading sale:', error);
        this.loading = false;
        this.router.navigate(['/sales']);
      }
    });
  }

  addDetail(existingDetail?: any): void {
    const detailGroup = this.fb.group({
      productId: [existingDetail?.product?.idProduct || '', [Validators.required]],
      quantity: [
        existingDetail?.quantity || 1,
        [
          Validators.required,
          Validators.min(1),
          SalesFormComponent.quantityValidator
        ]
      ],
      unitPrice: [
        existingDetail?.unitPrice || 0,
        [
          Validators.required,
          Validators.min(0.01),
          SalesFormComponent.priceValidator
        ]
      ],
      subtotal: [{ value: existingDetail?.subtotal || 0, disabled: true }]
    });

    // Calculate subtotal when quantity or price changes
    detailGroup.get('quantity')?.valueChanges.subscribe(() => this.calculateSubtotal(detailGroup));
    detailGroup.get('unitPrice')?.valueChanges.subscribe(() => this.calculateSubtotal(detailGroup));
    detailGroup.get('productId')?.valueChanges.subscribe((productId) => {
      this.onProductChange(productId, detailGroup);
      // Actualizar validador de stock cuando cambie el producto (solo en modo creación)
      const quantityControl = detailGroup.get('quantity');
      if (quantityControl && productId && !this.isEditMode) {
        quantityControl.setValidators([
          Validators.required,
          Validators.min(1),
          SalesFormComponent.quantityValidator,
          this.stockValidator(productId)
        ]);
        quantityControl.updateValueAndValidity();
      }
    });

    this.details.push(detailGroup);
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
    this.calculateTotal();
  }

  onProductChange(productId: number, detailGroup: FormGroup): void {
    const product = this.products.find(p => p.idProduct === productId);
    if (product) {
      detailGroup.patchValue({
        unitPrice: product.price
      });
      this.calculateSubtotal(detailGroup);
    }
  }

  calculateSubtotal(detailGroup: FormGroup): void {
    const quantity = detailGroup.get('quantity')?.value || 0;
    const unitPrice = detailGroup.get('unitPrice')?.value || 0;
    const subtotal = quantity * unitPrice;

    detailGroup.get('subtotal')?.setValue(subtotal);
    this.calculateTotal();
  }

  calculateTotal(): number {
    return this.details.controls.reduce((total, control) => {
      return total + (control.get('subtotal')?.value || 0);
    }, 0);
  }

  onSubmit(): void {
    console.log('=== SUBMIT STARTED ===');
    console.log('Form valid:', this.saleForm.valid);
    console.log('Form status:', this.saleForm.status);
    console.log('Details length:', this.details.length);
    console.log('Is Edit Mode:', this.isEditMode);
    console.log('Form errors:', this.saleForm.errors);
    console.log('Form value:', this.saleForm.getRawValue());

    // Verificar errores en cada control
    Object.keys(this.saleForm.controls).forEach(key => {
      const control = this.saleForm.get(key);
      if (control?.invalid) {
        console.log(`Field ${key} is invalid:`, control.errors);
      }
    });

    // Verificar errores en detalles
    this.details.controls.forEach((detail, index) => {
      if (detail.invalid) {
        console.log(`Detail ${index} is invalid:`, detail.errors);
        Object.keys((detail as FormGroup).controls).forEach(key => {
          const control = detail.get(key);
          if (control?.invalid) {
            console.log(`  - Field ${key} is invalid:`, control.errors);
          }
        });
      }
    });

    if (this.saleForm.valid && this.details.length > 0) {
      // Validar que todos los detalles tengan datos válidos
      const invalidDetails = this.details.controls.some(detail =>
        !detail.get('productId')?.value ||
        !detail.get('quantity')?.value ||
        detail.get('quantity')?.value <= 0 ||
        !detail.get('unitPrice')?.value ||
        detail.get('unitPrice')?.value <= 0
      );

      if (invalidDetails) {
        console.log('Invalid details found!');
        this.notificationService.validationError('Todos los productos deben tener cantidad y precio válidos.');
        return;
      }

      this.submitting = true;

      const formValue = this.saleForm.getRawValue(); // getRawValue incluye campos disabled

      console.log('=== RAW FORM VALUE ===');
      console.log('Raw form value:', formValue);
      console.log('customerId from form:', formValue.customerId);
      console.log('customerId type:', typeof formValue.customerId);
      console.log('Is Edit Mode:', this.isEditMode);
      console.log('Saved Customer ID:', this.savedCustomerId);

      // En modo edición, usar el savedCustomerId si el formValue.customerId es inválido
      const customerId = this.isEditMode && this.savedCustomerId
        ? this.savedCustomerId
        : Number(formValue.customerId);

      const saleData = {
        saleCode: formValue.saleCode || this.generatedSaleCode,
        saleDate: formValue.saleDate,
        customerId: customerId,
        employeeId: Number(formValue.employeeId),
        paymentMethod: formValue.paymentMethod,
        status: 'Completado',
        details: this.details.value.map((detail: any) => ({
          productId: Number(detail.productId),
          quantity: Number(detail.quantity),
          unitPrice: Number(detail.unitPrice)
        }))
      };

      console.log('=== SALE DATA VALIDATION ===');
      console.log('Sending sale data:', JSON.stringify(saleData, null, 2));
      console.log('Form valid:', this.saleForm.valid);
      console.log('Details count:', this.details.length);

      // Validate customer
      const selectedCustomer = this.customers.find(c => c.idCustomer === saleData.customerId);
      console.log('Selected customer:', selectedCustomer);
      if (!selectedCustomer) {
        console.error('Customer not found with ID:', saleData.customerId);
        this.notificationService.error('Cliente seleccionado no válido');
        this.submitting = false;
        return;
      }

      // Validate employee
      const selectedEmployee = this.employees.find(e => e.idEmployee === saleData.employeeId);
      console.log('Selected employee:', selectedEmployee);
      if (!selectedEmployee) {
        console.error('Employee not found with ID:', saleData.employeeId);
        this.notificationService.error('Empleado seleccionado no válido');
        this.submitting = false;
        return;
      }

      // Validate products (skip stock validation in edit mode)
      for (let detail of saleData.details) {
        const product = this.products.find(p => p.idProduct === detail.productId);
        console.log(`Product ${detail.productId}:`, product);
        if (!product) {
          console.error('Product not found with ID:', detail.productId);
          this.notificationService.error(`Producto con ID ${detail.productId} no encontrado`);
          this.submitting = false;
          return;
        }
        // Solo validar stock en modo creación, no en edición
        if (!this.isEditMode && product.stock < detail.quantity) {
          console.error(`Insufficient stock for product ${product.productName}. Available: ${product.stock}, Required: ${detail.quantity}`);
          this.notificationService.error(`Stock insuficiente para ${product.productName}. Disponible: ${product.stock}`);
          this.submitting = false;
          return;
        }
      }

      console.log('All validations passed!');

      console.log('=== OPERATION MODE ===');
      console.log('Is Edit Mode:', this.isEditMode);
      console.log('Sale ID:', this.saleId);
      console.log('Operation:', this.isEditMode ? 'UPDATE' : 'CREATE');

      const operation = this.isEditMode
        ? this.salesService.update(this.saleId!, saleData)
        : this.salesService.create(saleData);

      console.log('Operation created, subscribing...');

      operation.subscribe({
        next: (response) => {
          this.submitting = false;

          if (this.isEditMode) {
            this.notificationService.operationSuccess('actualización', `venta ${saleData.saleCode || 'N/A'}`);
          } else {
            this.notificationService.saleCreated(response.saleCode || 'N/A');
          }

          this.router.navigate(['/sales']);
        },
        error: (error: any) => {
          console.error('Error saving sale:', error);
          this.submitting = false;
          const operation = this.isEditMode ? 'actualizar' : 'crear';
          this.notificationService.operationError(operation, 'venta', error.error?.message || 'Error desconocido');
        }
      });
    } else {
      console.log('=== FORM VALIDATION FAILED ===');
      console.log('Form valid:', this.saleForm.valid);
      console.log('Details length:', this.details.length);

      if (this.details.length === 0) {
        console.log('No details added');
        this.notificationService.validationError('Debe agregar al menos un producto a la venta.');
      } else {
        console.log('Form has validation errors');
        this.notificationService.validationError('Por favor, completa todos los campos requeridos correctamente.');
      }
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/sales']);
  }

  generateSaleCode(): void {
    this.generatingCode = true;

    // Intentar obtener el código desde el backend
    this.salesService.generateNextSaleCode().subscribe({
      next: (saleCode: string) => {
        this.generatedSaleCode = saleCode;
        this.saleForm.patchValue({ saleCode: saleCode });
        this.generatingCode = false;
      },
      error: (error) => {
        console.error('Error generating sale code from backend:', error);
        // Fallback: generar código localmente
        const fallbackCode = this.generateLocalSaleCode();
        this.generatedSaleCode = fallbackCode;
        this.saleForm.patchValue({ saleCode: fallbackCode });
        this.generatingCode = false;
      }
    });
  }

  private generateLocalSaleCode(): string {
    const timestamp = Date.now().toString().slice(-4);
    return `VT${timestamp}`;
  }

  regenerateSaleCode(): void {
    if (!this.isEditMode) {
      this.generateSaleCode();
    }
  }

  testBackendConnection(): void {
    console.log('Testing backend connection...');
    this.salesService.testConnection().subscribe({
      next: (response) => {
        console.log('Backend test successful:', response);
        this.notificationService.success('Conexión con el backend exitosa');
      },
      error: (error) => {
        console.error('Backend test failed:', error);
        this.notificationService.error('Error de conexión con el backend');
      }
    });
  }

  validateSaleData(): void {
    if (this.saleForm.valid && this.details.length > 0) {
      const formValue = this.saleForm.getRawValue();
      const saleData = {
        saleCode: formValue.saleCode || this.generatedSaleCode,
        saleDate: formValue.saleDate,
        customerId: Number(formValue.customerId),
        employeeId: Number(formValue.employeeId),
        paymentMethod: formValue.paymentMethod,
        status: 'Completado',
        details: this.details.value.map((detail: any) => ({
          productId: Number(detail.productId),
          quantity: Number(detail.quantity),
          unitPrice: Number(detail.unitPrice)
        }))
      };

      console.log('Validating sale data...');
      this.salesService.validateSaleData(saleData).subscribe({
        next: (response) => {
          console.log('Validation successful:', response);
          this.notificationService.success('Datos válidos: ' + response);
        },
        error: (error) => {
          console.error('Validation failed:', error);
          this.notificationService.error('Error de validación: ' + (error.error || error.message));
        }
      });
    } else {
      this.notificationService.warning('Complete el formulario antes de validar');
    }
  }

  checkAvailableData(): void {
    console.log('Checking available data...');
    this.salesService.checkAvailableData().subscribe({
      next: (response) => {
        console.log('Available data:', response);
        // Mostrar en un modal o alert
        alert('Datos disponibles:\n\n' + response);
      },
      error: (error) => {
        console.error('Check data failed:', error);
        this.notificationService.error('Error al verificar datos: ' + (error.error || error.message));
      }
    });
  }

  testSimpleSave(): void {
    if (this.saleForm.get('customerId')?.value && this.saleForm.get('employeeId')?.value) {
      const saleData = {
        customerId: Number(this.saleForm.get('customerId')?.value),
        employeeId: Number(this.saleForm.get('employeeId')?.value),
        paymentMethod: this.saleForm.get('paymentMethod')?.value || 'Efectivo',
        status: 'Pendiente',
        details: [] // Sin detalles para test simple
      };

      console.log('Testing simple save...');
      this.salesService.testSimpleSave(saleData).subscribe({
        next: (response) => {
          console.log('Simple save test successful:', response);
          this.notificationService.success('Test simple exitoso: ' + response);
        },
        error: (error) => {
          console.error('Simple save test failed:', error);
          this.notificationService.error('Test simple falló: ' + (error.error || error.message));
        }
      });
    } else {
      this.notificationService.warning('Seleccione cliente y empleado para el test simple');
    }
  }

  createTestData(): void {
    console.log('Creating test sales data...');
    this.salesService.createTestData().subscribe({
      next: (response) => {
        console.log('Test data created successfully:', response);
        this.notificationService.success('Datos de prueba creados exitosamente');
        // Mostrar detalles en un alert
        alert('Datos de prueba creados:\n\n' + response);
      },
      error: (error) => {
        console.error('Failed to create test data:', error);
        this.notificationService.error('Error al crear datos de prueba: ' + (error.error || error.message));
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.saleForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }

  getDetailErrorMessage(detailGroup: any, fieldName: string): string {
    if (detailGroup && typeof detailGroup.get === 'function') {
      const field = detailGroup.get(fieldName);
      if (field?.errors && field.touched) {
        if (field.errors['required']) {
          return 'Este campo es requerido';
        }
        if (field.errors['min']) {
          return `El valor debe ser mayor a ${field.errors['min'].min}`;
        }
        if (field.errors['invalidQuantity']) {
          return 'La cantidad debe ser un número entero mayor a 0';
        }
        if (field.errors['invalidPrice']) {
          return 'El precio debe ser mayor a 0.01';
        }
        if (field.errors['insufficientStock']) {
          return `Stock insuficiente. Disponible: ${field.errors['insufficientStock'].available}`;
        }
        if (field.errors['positiveNumber']) {
          return 'Debe ser un número positivo';
        }
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.saleForm.controls).forEach(key => {
      const control = this.saleForm.get(key);
      control?.markAsTouched();
    });

    this.details.controls.forEach((detail: any) => {
      Object.keys(detail.controls).forEach(key => {
        detail.get(key)?.markAsTouched();
      });
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.saleForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    return '';
  }

  getDetailFieldError(detailGroup: any, fieldName: string): string {
    if (detailGroup && typeof detailGroup.get === 'function') {
      const field = detailGroup.get(fieldName);
      if (field?.errors && field.touched) {
        if (field.errors['required']) return `${this.getDetailFieldLabel(fieldName)} es requerido`;
        if (field.errors['min']) return `${this.getDetailFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      saleCode: 'Código de venta',
      customerId: 'Cliente',
      employeeId: 'Empleado',
      paymentMethod: 'Método de pago',
      saleDate: 'Fecha de venta'
    };
    return labels[fieldName] || fieldName;
  }

  private getDetailFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      productId: 'Producto',
      quantity: 'Cantidad',
      unitPrice: 'Precio unitario'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.saleForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  isDetailFieldInvalid(detailGroup: any, fieldName: string): boolean {
    if (detailGroup && typeof detailGroup.get === 'function') {
      const field = detailGroup.get(fieldName);
      return !!(field?.invalid && field.touched);
    }
    return false;
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.idCustomer === customerId);
    return customer ? `${customer.name} ${customer.surname}` : '';
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.idProduct === productId);
    return product ? product.productName : '';
  }

  getProductStock(productId: number): number {
    const product = this.products.find(p => p.idProduct === productId);
    return product ? product.stock : 0;
  }

  // Validadores personalizados
  static positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { positiveNumber: { value: control.value } };
    }
    return null;
  }

  static quantityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 1 || !Number.isInteger(Number(value)))) {
      return { invalidQuantity: { value: control.value } };
    }
    return null;
  }

  static priceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0.01)) {
      return { invalidPrice: { value: control.value } };
    }
    return null;
  }

  // Validador para verificar stock disponible
  stockValidator(productId: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const quantity = control.value;
      const availableStock = this.getProductStock(productId);

      if (quantity && availableStock && quantity > availableStock) {
        return { insufficientStock: { requested: quantity, available: availableStock } };
      }
      return null;
    };
  }

  // Método para validar si el formulario es válido (considerando campos deshabilitados)
  isFormValid(): boolean {
    const formValue = this.saleForm.getRawValue();

    // Validar campos requeridos
    const hasCustomer = !!formValue.customerId;
    const hasEmployee = !!formValue.employeeId;
    const hasPaymentMethod = !!formValue.paymentMethod;
    const hasSaleCode = !!formValue.saleCode;
    const hasSaleDate = !!formValue.saleDate;

    // Validar que todos los detalles sean válidos
    const allDetailsValid = this.details.controls.every(detail => {
      const productId = detail.get('productId')?.value;
      const quantity = detail.get('quantity')?.value;
      const unitPrice = detail.get('unitPrice')?.value;

      return productId && quantity > 0 && unitPrice > 0;
    });

    const isValid = hasCustomer && hasEmployee && hasPaymentMethod && hasSaleCode && hasSaleDate && allDetailsValid;

    // Log para debugging
    console.log('=== FORM VALIDATION CHECK ===');
    console.log('Has Customer:', hasCustomer, formValue.customerId);
    console.log('Has Employee:', hasEmployee, formValue.employeeId);
    console.log('Has Payment Method:', hasPaymentMethod, formValue.paymentMethod);
    console.log('Has Sale Code:', hasSaleCode, formValue.saleCode);
    console.log('Has Sale Date:', hasSaleDate, formValue.saleDate);
    console.log('All Details Valid:', allDetailsValid);
    console.log('Details count:', this.details.length);
    console.log('Final isValid:', isValid);

    return isValid;
  }
}