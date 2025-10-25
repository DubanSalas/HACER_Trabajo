import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { SalesService } from '../../../core/services/sales.service';
import { CustomerService } from '../../../core/services/customer.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { ProductsService } from '../../../core/services/products.service';
import { SaleWithDetails, CreateSaleRequest, UpdateSaleRequest, SaleProduct } from '../../../core/interfaces/sales-interfaces';
import { Customer } from '../../../core/interfaces/customer-interfaces';
import { Employee } from '../../../core/interfaces/employees-interfaces';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sales-form.html',
  styleUrls: ['./sales-form.scss']
})
export class SalesFormComponent implements OnInit, OnDestroy {
  @Input() sale: SaleWithDetails | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  saleForm: FormGroup;
  customers: Customer[] = [];
  employees: Employee[] = [];
  products: SaleProduct[] = [];
  loading = false;
  isEditMode = false;

  estados = ['Pendiente', 'Completado', 'Cancelado'];
  metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private customersService: CustomerService,
    private employeesService: EmployeesService,
    private productsService: ProductsService
  ) {
    this.saleForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.sale;
    this.loadInitialData();
    
    if (this.sale) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id_cliente: ['', Validators.required],
      id_empleado: ['', Validators.required],
      metodo_pago: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      detalles: this.fb.array([])
    });
  }

  private loadInitialData(): void {
    this.loadCustomers();
    this.loadEmployees();
    this.loadProducts();
  }

  private loadCustomers(): void {
    this.customersService.getCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customers: Customer[]) => this.customers = customers,
        error: (error: any) => console.error('Error loading customers:', error)
      });
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => this.employees = employees,
        error: (error) => console.error('Error loading employees:', error)
      });
  }

  private loadProducts(): void {
    this.salesService.getProductsForSale()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => this.products = products,
        error: (error) => {
          console.error('Error loading products:', error);
          // Fallback to products service
          this.productsService.getProducts()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (products) => {
                this.products = products.map(p => ({
                  id_Product: p.id_Product!,
                  Name: p.Product_Name,
                  Price: p.Price,
                  Stock: p.Stock
                }));
              },
              error: (error) => console.error('Error loading products from fallback:', error)
            });
        }
      });
  }

  private populateForm(): void {
    if (!this.sale) return;

    this.saleForm.patchValue({
      id_cliente: this.sale.idCustomer,
      id_empleado: this.sale.id_Employee,
      metodo_pago: this.sale.metodo_pago,
      estado: this.sale.estado
    });

    // Populate details
    const detallesArray = this.saleForm.get('detalles') as FormArray;
    this.sale.detalles.forEach(detalle => {
      detallesArray.push(this.createDetalleGroup({
        id_producto: detalle.id_Product,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario
      }));
    });
  }

  get detallesArray(): FormArray {
    return this.saleForm.get('detalles') as FormArray;
  }

  private createDetalleGroup(detalle?: any): FormGroup {
    return this.fb.group({
      id_producto: [detalle?.id_producto || '', Validators.required],
      cantidad: [detalle?.cantidad || 1, [Validators.required, Validators.min(1)]],
      precio_unitario: [detalle?.precio_unitario || 0, [Validators.required, Validators.min(0)]]
    });
  }

  addProduct(): void {
    this.detallesArray.push(this.createDetalleGroup());
  }

  removeProduct(index: number): void {
    if (this.detallesArray.length > 1) {
      this.detallesArray.removeAt(index);
    }
  }

  onProductChange(index: number): void {
    const detalleGroup = this.detallesArray.at(index) as FormGroup;
    const productId = detalleGroup.get('id_producto')?.value;
    
    if (productId) {
      const product = this.products.find(p => p.id_Product === productId);
      if (product) {
        detalleGroup.patchValue({
          precio_unitario: product.Price
        });
      }
    }
  }

  onQuantityChange(index: number): void {
    // Trigger calculation when quantity changes
    this.calculateTotal();
  }

  onPriceChange(index: number): void {
    // Trigger calculation when price changes
    this.calculateTotal();
  }

  calculateTotal(): number {
    let total = 0;
    
    this.detallesArray.controls.forEach(control => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precio_unitario')?.value || 0;
      total += cantidad * precio;
    });
    
    return total;
  }

  getSubtotal(index: number): number {
    const detalleGroup = this.detallesArray.at(index) as FormGroup;
    const cantidad = detalleGroup.get('cantidad')?.value || 0;
    const precio = detalleGroup.get('precio_unitario')?.value || 0;
    return cantidad * precio;
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id_Product === productId);
    return product ? product.Name : 'Producto no encontrado';
  }

  getProductStock(productId: number): number {
    const product = this.products.find(p => p.id_Product === productId);
    return product ? product.Stock : 0;
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      this.loading = true;
      
      const formValue = this.saleForm.value;
      
      // Prepare details with calculated subtotals
      const detalles = formValue.detalles.map((detalle: any) => ({
        id_Product: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario
      }));

      if (this.isEditMode && this.sale) {
        const updateRequest: UpdateSaleRequest = {
          idCustomer: formValue.id_cliente,
          id_Employee: formValue.id_empleado,
          metodo_pago: formValue.metodo_pago,
          estado: formValue.estado,
          detalles
        };

        this.salesService.updateSale(this.sale.id_venta, updateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Venta actualizada correctamente',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error updating sale:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la venta',
                icon: 'error',
                confirmButtonColor: '#7c1d3b'
              });
            }
          });
      } else {
        const createRequest: CreateSaleRequest = {
          idCustomer: formValue.id_cliente,
          id_Employee: formValue.id_empleado,
          metodo_pago: formValue.metodo_pago,
          estado: formValue.estado,
          detalles
        };

        this.salesService.createSale(createRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Venta creada correctamente',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error creating sale:', error);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo crear la venta',
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
    Object.keys(this.saleForm.controls).forEach(key => {
      const control = this.saleForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(nestedKey => {
              arrayControl.get(nestedKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.saleForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isDetalleFieldInvalid(index: number, fieldName: string): boolean {
    const detalleGroup = this.detallesArray.at(index) as FormGroup;
    const field = detalleGroup.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.saleForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  getDetalleFieldError(index: number, fieldName: string): string {
    const detalleGroup = this.detallesArray.at(index) as FormGroup;
    const field = detalleGroup.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }
}