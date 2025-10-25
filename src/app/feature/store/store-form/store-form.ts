import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { StoreService } from '../../../core/services/store.service';
import { ProductsService } from '../../../core/services/products.service';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { StoreItem, CreateStoreItemRequest, UpdateStoreItemRequest } from '../../../core/interfaces/store-interfaces';
import { Product } from '../../../core/interfaces/products-interfaces';
import { Supplier } from '../../../core/interfaces/suppliers-interfaces';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.scss']
})
export class StoreFormComponent implements OnInit, OnDestroy {
  @Input() storeItem: StoreItem | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  storeForm: FormGroup;
  products: Product[] = [];
  suppliers: Supplier[] = [];
  loading = false;
  isEditMode = false;

  units: string[] = [];
  statuses: string[] = [];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private productsService: ProductsService,
    private suppliersService: SuppliersService
  ) {
    this.storeForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.storeItem;
    this.loadInitialData();
    
    if (this.storeItem) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id_Product: ['', Validators.required],
      current_stock: [0, [Validators.required, Validators.min(0)]],
      min_stock: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      unit_price: [0, [Validators.required, Validators.min(0)]],
      id_Supplier: ['', Validators.required],
      expiry_date: ['', Validators.required],
      location: ['', Validators.required],
      status: ['Disponible', Validators.required]
    });
  }

  private loadInitialData(): void {
    this.loadProducts();
    this.loadSuppliers();
    this.loadUnits();
    this.loadStatuses();
  }

  private loadProducts(): void {
    this.productsService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: Product[]) => this.products = products,
        error: (error: any) => console.error('Error loading products:', error)
      });
  }

  private loadSuppliers(): void {
    this.suppliersService.getSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suppliers: Supplier[]) => this.suppliers = suppliers,
        error: (error: any) => console.error('Error loading suppliers:', error)
      });
  }

  private loadUnits(): void {
    this.units = this.storeService.getUnits();
  }

  private loadStatuses(): void {
    this.statuses = this.storeService.getStatuses();
  }

  private populateForm(): void {
    if (!this.storeItem) return;

    this.storeForm.patchValue({
      id_Product: this.storeItem.id_Product,
      current_stock: this.storeItem.current_stock,
      min_stock: this.storeItem.min_stock,
      unit: this.storeItem.unit,
      unit_price: this.storeItem.unit_price,
      id_Supplier: this.storeItem.id_Supplier,
      expiry_date: this.storeItem.expiry_date,
      location: this.storeItem.location,
      status: this.storeItem.status
    });
  }

  onProductChange(): void {
    const productId = this.storeForm.get('id_Product')?.value;
    if (productId) {
      const product = this.products.find(p => p.id_Product === productId);
      if (product) {
        this.storeForm.patchValue({
          unit_price: product.Price
        });
      }
    }
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      this.loading = true;
      
      const formValue = this.storeForm.value;

      if (this.isEditMode && this.storeItem) {
        const updateRequest: UpdateStoreItemRequest = {
          id_Product: formValue.id_Product,
          current_stock: formValue.current_stock,
          min_stock: formValue.min_stock,
          unit: formValue.unit,
          unit_price: formValue.unit_price,
          id_Supplier: formValue.id_Supplier,
          expiry_date: formValue.expiry_date,
          location: formValue.location,
          status: formValue.status
        };

        this.storeService.updateStoreItem(this.storeItem.id_store, updateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Producto actualizado correctamente en el almacén',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error updating store item:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el producto',
                icon: 'error',
                confirmButtonColor: '#7c1d3b'
              });
            }
          });
      } else {
        const createRequest: CreateStoreItemRequest = {
          id_Product: formValue.id_Product,
          current_stock: formValue.current_stock,
          min_stock: formValue.min_stock,
          unit: formValue.unit,
          unit_price: formValue.unit_price,
          id_Supplier: formValue.id_Supplier,
          expiry_date: formValue.expiry_date,
          location: formValue.location,
          status: formValue.status
        };

        this.storeService.createStoreItem(createRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Producto agregado correctamente al almacén',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error creating store item:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el producto al almacén',
                icon: 'error',
                confirmButtonColor: '#7c1d3b'
              });
            }
          });
      }
    } else {
      this.markFormGroupTouched();
      Swal.fire({
        title: 'Formulario Incompleto',
        text: 'Por favor, completa todos los campos requeridos',
        icon: 'warning',
        confirmButtonColor: '#7c1d3b'
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.storeForm.controls).forEach(key => {
      const control = this.storeForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.storeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.storeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor o igual a ${field.errors['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'id_Product': 'Producto',
      'current_stock': 'Stock actual',
      'min_stock': 'Stock mínimo',
      'unit': 'Unidad',
      'unit_price': 'Precio unitario',
      'id_Supplier': 'Proveedor',
      'expiry_date': 'Fecha de vencimiento',
      'location': 'Ubicación',
      'status': 'Estado'
    };
    return labels[fieldName] || fieldName;
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id_Product === productId);
    return product ? product.Product_Name : 'Producto no encontrado';
  }

  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.id_Supplier === supplierId);
    return supplier ? supplier.Company_Name : 'Proveedor no encontrado';
  }

  calculateTotalValue(): number {
    const stock = this.storeForm.get('current_stock')?.value || 0;
    const price = this.storeForm.get('unit_price')?.value || 0;
    return stock * price;
  }
}