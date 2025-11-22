import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { SupplierDTO, SupplierRequest } from '../../../core/interfaces/suppliers-interfaces';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './supplier-form.html',
  styleUrls: ['./supplier-form.scss']
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId: number | null = null;
  loading = false;
  submitting = false;

  categories = [
    'Harinas y Cereales',
    'Productos Lácteos',
    'Ingredientes de Repostería',
    'Empaques y Envases',
    'Equipos y Maquinaria',
    'Servicios',
    'Otros'
  ];

  paymentTerms = [
    'Contado',
    '15 días',
    '30 días',
    '45 días',
    '60 días',
    '90 días'
  ];

  constructor(
    private fb: FormBuilder,
    private suppliersService: SuppliersService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.supplierForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.supplierId = +params['id'];
        this.loadSupplier();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      companyName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        CustomValidators.noOnlySpaces(),
        CustomValidators.noSpecialCharactersStart(),
        CustomValidators.businessName()
      ]],
      contactName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        CustomValidators.noOnlySpaces(),
        CustomValidators.alphabeticWithSpaces(),
        CustomValidators.noMultipleSpaces()
      ]],
      phone: ['', [
        Validators.required,
        CustomValidators.peruvianPhone()
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        CustomValidators.businessEmail()
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
        CustomValidators.noOnlySpaces(),
        CustomValidators.validAddress()
      ]],
      category: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      locationId: [1, Validators.required],
      status: ['A', Validators.required]
    });
  }

  loadSupplier(): void {
    if (!this.supplierId) return;
    
    this.loading = true;
    this.suppliersService.getById(this.supplierId).subscribe({
      next: (supplier: SupplierDTO) => {
        this.supplierForm.patchValue({
          companyName: supplier.companyName,
          contactName: supplier.contactName,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
          category: supplier.category,
          paymentTerms: supplier.paymentTerms,
          locationId: supplier.locationId,
          status: supplier.status
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading supplier:', error);
        this.loading = false;
        this.router.navigate(['/suppliers']);
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      this.submitting = true;
      const supplierData: SupplierRequest = this.supplierForm.value;

      const operation = this.isEditMode
        ? this.suppliersService.update(this.supplierId!, supplierData)
        : this.suppliersService.create(supplierData);

      operation.subscribe({
        next: () => {
          this.submitting = false;
          const supplierName = supplierData.companyName;
          
          if (this.isEditMode) {
            this.notificationService.operationSuccess('actualización', `proveedor ${supplierName}`);
          } else {
            this.notificationService.operationSuccess('creación', `proveedor ${supplierName}`);
          }
          
          this.router.navigate(['/suppliers']);
        },
        error: (error: any) => {
          console.error('Error saving supplier:', error);
          this.submitting = false;
          const operation = this.isEditMode ? 'actualizar' : 'crear';
          this.notificationService.operationError(operation, 'proveedor', error.error?.message);
        }
      });
    } else {
      this.notificationService.validationError('Por favor, completa todos los campos requeridos correctamente.');
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) return 'Este campo es requerido';
    if (field.hasError('email')) return 'Ingrese un email válido';
    if (field.hasError('minlength')) return `Mínimo ${field.errors?.['minlength']?.requiredLength} caracteres`;
    if (field.hasError('maxlength')) return `Máximo ${field.errors?.['maxlength']?.requiredLength} caracteres`;
    if (field.hasError('noOnlySpaces')) return 'No puede contener solo espacios';
    if (field.hasError('noSpecialCharactersStart')) return 'No puede comenzar con caracteres especiales';
    if (field.hasError('businessName')) return 'Nombre de empresa inválido';
    if (field.hasError('alphabeticWithSpaces')) return 'Solo se permiten letras y espacios';
    if (field.hasError('noMultipleSpaces')) return 'No se permiten espacios múltiples';
    if (field.hasError('peruvianPhone')) return 'Teléfono debe comenzar con 9 y tener 9 dígitos';
    if (field.hasError('businessEmail')) return 'Email empresarial inválido';
    if (field.hasError('validAddress')) return 'Dirección inválida';
    
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.supplierForm.controls).forEach(key => {
      const control = this.supplierForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Ingrese un email válido';
      if (field.errors['pattern']) return 'Ingrese un teléfono válido (9 dígitos)';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      companyName: 'Nombre de la empresa',
      contactName: 'Nombre del contacto',
      phone: 'Teléfono',
      email: 'Email',
      address: 'Dirección',
      category: 'Categoría',
      paymentTerms: 'Términos de pago'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}