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

import { CustomerService } from '../../../core/services/customer.service';
import { Customer, CustomerRequest } from '../../../core/interfaces/customer-interfaces';

@Component({
  selector: 'app-customer-form',
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
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  @Input() customer: Customer | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  customerForm: FormGroup;
  loading = false;
  isEditMode = false;

  documentTypes = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PAS', label: 'Pasaporte' }
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.customerForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.customer;
    
    if (!this.isEditMode) {
      this.generateClientCode();
    }
    
    if (this.customer) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      clientCode: ['', Validators.required],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      dateBirth: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      locationAddress: ['', Validators.required],
      status: ['A']
    });
  }

  private generateClientCode(): void {
    this.customerService.generateNextClientCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (code) => {
          this.customerForm.patchValue({ clientCode: code });
        },
        error: (error) => {
          console.error('Error generating client code:', error);
        }
      });
  }

  private populateForm(): void {
    if (!this.customer) return;

    this.customerForm.patchValue({
      clientCode: this.customer.clientCode,
      documentType: this.customer.documentType,
      documentNumber: this.customer.documentNumber,
      name: this.customer.name,
      surname: this.customer.surname,
      dateBirth: this.customer.dateBirth,
      phone: this.customer.phone,
      email: this.customer.email,
      department: this.customer.department,
      province: this.customer.province,
      district: this.customer.district,
      locationAddress: this.customer.locationAddress,
      status: this.customer.status
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      
      const formValue = this.customerForm.value;
      const customerRequest: CustomerRequest = {
        clientCode: formValue.clientCode,
        documentType: formValue.documentType,
        documentNumber: formValue.documentNumber,
        name: formValue.name,
        surname: formValue.surname,
        dateBirth: formValue.dateBirth,
        phone: formValue.phone,
        email: formValue.email,
        locationId: 1, // Por ahora usamos un ID fijo, puedes implementar la selección de ubicación
        status: formValue.status || 'A'
      };

      if (this.isEditMode && this.customer) {
        this.customerService.updateCustomer(this.customer.idCustomer!, customerRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Cliente actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error updating customer:', error);
              this.handleError(error);
            }
          });
      } else {
        this.customerService.createCustomer(customerRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Éxito',
                text: 'Cliente creado correctamente',
                icon: 'success',
                confirmButtonColor: '#7c1d3b'
              });
              this.success.emit();
            },
            error: (error) => {
              this.loading = false;
              console.error('Error creating customer:', error);
              this.handleError(error);
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

  private handleError(error: any): void {
    let errorMessage = 'No se pudo procesar la solicitud';
    
    if (error.status === 400) {
      errorMessage = 'Ya existe un cliente con estos datos (código, documento o email)';
    }
    
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#7c1d3b'
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  // Validaciones en tiempo real
  onClientCodeChange(): void {
    const clientCode = this.customerForm.get('clientCode')?.value;
    if (clientCode && clientCode.length >= 3) {
      this.customerService.existsByClientCode(clientCode)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists) => {
            if (exists && !this.isEditMode) {
              this.customerForm.get('clientCode')?.setErrors({ exists: true });
            }
          },
          error: (error) => console.error('Error checking client code:', error)
        });
    }
  }

  onDocumentNumberChange(): void {
    const documentNumber = this.customerForm.get('documentNumber')?.value;
    if (documentNumber && documentNumber.length >= 8) {
      this.customerService.existsByDocumentNumber(documentNumber)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists) => {
            if (exists && (!this.isEditMode || this.customer?.documentNumber !== documentNumber)) {
              this.customerForm.get('documentNumber')?.setErrors({ exists: true });
            }
          },
          error: (error) => console.error('Error checking document number:', error)
        });
    }
  }

  onEmailChange(): void {
    const email = this.customerForm.get('email')?.value;
    if (email && this.customerForm.get('email')?.valid) {
      this.customerService.existsByEmail(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (exists) => {
            if (exists && (!this.isEditMode || this.customer?.email !== email)) {
              this.customerForm.get('email')?.setErrors({ exists: true });
            }
          },
          error: (error) => console.error('Error checking email:', error)
        });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} tiene formato inválido`;
      if (field.errors['exists']) return `Este ${this.getFieldLabel(fieldName).toLowerCase()} ya existe`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'clientCode': 'Código de cliente',
      'documentType': 'Tipo de documento',
      'documentNumber': 'Número de documento',
      'name': 'Nombre',
      'surname': 'Apellido',
      'dateBirth': 'Fecha de nacimiento',
      'phone': 'Teléfono',
      'email': 'Email',
      'department': 'Departamento',
      'province': 'Provincia',
      'district': 'Distrito',
      'locationAddress': 'Dirección'
    };
    return labels[fieldName] || fieldName;
  }
}