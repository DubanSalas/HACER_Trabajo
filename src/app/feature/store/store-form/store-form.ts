import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { StoreService } from '../../../core/services/store.service';
import { ProductsService } from '../../../core/services/products.service';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.scss']
})
export class StoreFormComponent implements OnInit {
  storeForm: FormGroup;
  isEditMode = false;
  storeItemId: number | null = null;
  loading = false;
  submitting = false;

  products: any[] = [];
  suppliers: any[] = [];
  selectedProduct: any = null;

  locations = [
    'Almacén Principal',
    'Vitrina Principal',
    'Vitrina Secundaria',
    'Refrigerador',
    'Congelador',
    'Área de Producción',
    'Bodega',
    'Mostrador'
  ];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private productsService: ProductsService,
    private suppliersService: SuppliersService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.storeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.storeItemId = +params['id'];
        this.loadStoreItem();
      }
    });

    // Watch for product changes
    this.storeForm.get('productId')?.valueChanges.subscribe(productId => {
      this.onProductChange(productId);
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      currentStock: ['', [
        Validators.required,
        Validators.min(0),
        CustomValidators.positiveInteger()
      ]],
      minimumStock: ['', [
        Validators.required,
        Validators.min(1),
        CustomValidators.positiveInteger()
      ]],
      location: ['', Validators.required],
      supplier: ['', [
        Validators.minLength(2),
        Validators.maxLength(100),
        CustomValidators.noOnlySpaces()
      ]],
      lastRestockDate: ['', [this.pastDateValidator]],
      expirationDate: ['', [this.futureDateValidator]],
      notes: ['', [
        Validators.maxLength(500),
        CustomValidators.noOnlySpaces()
      ]]
    }, { validators: [this.stockComparisonValidator, this.dateRangeValidator] });
  }

  loadInitialData(): void {
    // Load products
    this.productsService.getAll().subscribe({
      next: (products: any[]) => {
        this.products = products.filter(p => p.status === 'A');
      },
      error: (error: any) => console.error('Error loading products:', error)
    });

    // Load suppliers
    this.suppliersService.getAll().subscribe({
      next: (suppliers: any[]) => {
        this.suppliers = suppliers.filter(s => s.status === 'A');
      },
      error: (error: any) => console.error('Error loading suppliers:', error)
    });
  }

  loadStoreItem(): void {
    if (!this.storeItemId) return;
    
    this.loading = true;
    this.storeService.getById(this.storeItemId).subscribe({
      next: (item: any) => {
        this.storeForm.patchValue({
          productId: item.product?.idProduct,
          currentStock: item.currentStock,
          minimumStock: item.minimumStock,
          location: item.location,
          supplier: item.supplier,
          lastRestockDate: item.lastRestockDate,
          expirationDate: item.expirationDate,
          notes: item.notes
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading store item:', error);
        this.loading = false;
        this.router.navigate(['/store']);
      }
    });
  }

  onProductChange(productId: number): void {
    this.selectedProduct = this.products.find(p => p.idProduct === productId);
    if (this.selectedProduct) {
      // Auto-fill current stock from product
      this.storeForm.patchValue({
        currentStock: this.selectedProduct.stock
      });
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      // Validación adicional de stock
      if (this.showStockAlert()) {
        const confirmed = confirm('⚠️ El stock actual está por debajo del mínimo. ¿Desea continuar?');
        if (!confirmed) return;
      }
      
      this.submitting = true;
      const storeData = this.storeForm.value;

      const operation = this.isEditMode
        ? this.storeService.update(this.storeItemId!, storeData)
        : this.storeService.create(storeData);

      operation.subscribe({
        next: () => {
          this.submitting = false;
          const productName = this.selectedProduct?.productName || 'producto';
          
          if (this.isEditMode) {
            this.notificationService.operationSuccess('actualización', `inventario de ${productName}`);
          } else {
            this.notificationService.operationSuccess('creación', `inventario de ${productName}`);
          }
          
          this.router.navigate(['/store']);
        },
        error: (error: any) => {
          console.error('Error saving store item:', error);
          this.submitting = false;
          const operation = this.isEditMode ? 'actualizar' : 'crear';
          this.notificationService.operationError(operation, 'inventario', error.error?.message);
        }
      });
    } else {
      this.notificationService.validationError('Por favor, completa todos los campos requeridos correctamente.');
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/store']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.storeForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) return 'Este campo es requerido';
    if (field.hasError('min')) return `El valor debe ser mayor o igual a ${field.errors?.['min']?.min}`;
    if (field.hasError('positiveInteger')) return 'Debe ser un número entero positivo';
    if (field.hasError('noOnlySpaces')) return 'No puede contener solo espacios';
    if (field.hasError('maxlength')) return `Máximo ${field.errors?.['maxlength']?.requiredLength} caracteres`;
    if (field.hasError('pastDate')) return 'La fecha debe ser anterior o igual a hoy';
    if (field.hasError('futureDate')) return 'La fecha debe ser posterior a hoy';
    
    // Errores del formulario completo
    if (this.storeForm.hasError('stockComparison')) {
      return 'El stock actual no puede ser menor que el stock mínimo';
    }
    if (this.storeForm.hasError('dateRange')) {
      return 'La fecha de vencimiento debe ser posterior a la fecha de reabastecimiento';
    }
    
    return '';
  }

  // Validadores personalizados
  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return { pastDate: true };
    }
    return null;
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      return { futureDate: true };
    }
    return null;
  }

  stockComparisonValidator(group: AbstractControl): ValidationErrors | null {
    const currentStock = group.get('currentStock')?.value;
    const minimumStock = group.get('minimumStock')?.value;
    
    if (currentStock !== null && minimumStock !== null && currentStock < minimumStock) {
      return { stockComparison: true };
    }
    return null;
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const lastRestock = group.get('lastRestockDate')?.value;
    const expiration = group.get('expirationDate')?.value;
    
    if (lastRestock && expiration) {
      const restockDate = new Date(lastRestock);
      const expirationDate = new Date(expiration);
      
      if (expirationDate <= restockDate) {
        return { dateRange: true };
      }
    }
    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.storeForm.controls).forEach(key => {
      const control = this.storeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.storeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor o igual a ${field.errors['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      productId: 'Producto',
      currentStock: 'Stock actual',
      minimumStock: 'Stock mínimo',
      location: 'Ubicación'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.storeForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  // Stock calculation methods
  getStockDifference(): number {
    const current = this.storeForm.get('currentStock')?.value || 0;
    const minimum = this.storeForm.get('minimumStock')?.value || 0;
    return current - minimum;
  }

  getStockPercentage(): number {
    const current = this.storeForm.get('currentStock')?.value || 0;
    const minimum = this.storeForm.get('minimumStock')?.value || 1;
    return Math.min(100, (current / minimum) * 100);
  }

  getStockStatus(): string {
    const difference = this.getStockDifference();
    if (difference < 0) return 'Stock Crítico';
    if (difference === 0) return 'Stock Mínimo';
    if (difference <= 5) return 'Stock Bajo';
    return 'Stock Normal';
  }

  getStockStatusClass(): string {
    const difference = this.getStockDifference();
    if (difference < 0) return 'status-critical';
    if (difference === 0) return 'status-minimum';
    if (difference <= 5) return 'status-low';
    return 'status-normal';
  }

  getStockDifferenceClass(): string {
    const difference = this.getStockDifference();
    return difference >= 0 ? 'positive' : 'negative';
  }

  showStockAlert(): boolean {
    const current = this.storeForm.get('currentStock')?.value;
    const minimum = this.storeForm.get('minimumStock')?.value;
    return current !== null && minimum !== null && current < minimum;
  }

  getStockAlertClass(): string {
    const difference = this.getStockDifference();
    if (difference < -10) return 'alert-danger';
    if (difference < 0) return 'alert-warning';
    return 'alert-info';
  }

  getStockAlertMessage(): string {
    const difference = this.getStockDifference();
    if (difference < -10) return '⚠️ Stock crítico: Necesita reposición urgente';
    if (difference < 0) return '⚠️ Stock por debajo del mínimo';
    return 'ℹ️ Stock en nivel aceptable';
  }
}