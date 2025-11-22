import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeesService } from '../../../core/services/employees.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './employees-form.html',
  styleUrls: ['./employees-form.scss']
})
export class EmployeesFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  submitting = false;

  positions = [
    'Gerente',
    'Panadero',
    'Repostero',
    'Cajero',
    'Vendedor',
    'Ayudante',
    'Limpieza',
    'Seguridad'
  ];

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        CustomValidators.name(),
        CustomValidators.noMultipleSpaces()
      ]],
      surname: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        CustomValidators.name(),
        CustomValidators.noMultipleSpaces()
      ]],
      dni: ['', [
        Validators.required, 
        CustomValidators.dni()
      ]],
      phone: ['', [
        Validators.required, 
        CustomValidators.phone()
      ]],
      email: ['', [
        Validators.required, 
        CustomValidators.email()
      ]],
      address: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(200)
      ]],
      positionName: ['', Validators.required],
      salary: ['', [
        Validators.required, 
        CustomValidators.price(),
        Validators.min(1025) // Salario mínimo en Perú
      ]],
      hireDate: ['', [
        Validators.required,
        CustomValidators.hireDate()
      ]],
      status: ['A', Validators.required]
    });
  }

  loadEmployee(): void {
    if (!this.employeeId) return;
    
    this.loading = true;
    this.employeesService.getById(this.employeeId).subscribe({
      next: (employee: any) => {
        this.employeeForm.patchValue({
          name: employee.name,
          surname: employee.surname,
          dni: employee.dni,
          phone: employee.phone,
          email: employee.email,
          address: employee.address,
          positionName: employee.position?.positionName || employee.positionName,
          salary: employee.salary,
          hireDate: employee.hireDate,
          status: employee.status
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading employee:', error);
        this.loading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.submitting = true;
      const employeeData = this.employeeForm.value;
      const employeeName = `${employeeData.name} ${employeeData.surname}`;

      const operation = this.isEditMode
        ? this.employeesService.update(this.employeeId!, employeeData)
        : this.employeesService.create(employeeData);

      operation.subscribe({
        next: () => {
          this.submitting = false;
          
          if (this.isEditMode) {
            this.notificationService.employeeUpdated(employeeName);
          } else {
            this.notificationService.employeeCreated(employeeName);
          }
          
          this.router.navigate(['/employees']);
        },
        error: (error: any) => {
          console.error('Error saving employee:', error);
          this.submitting = false;
          
          const operation = this.isEditMode ? 'actualizar' : 'crear';
          this.notificationService.operationError(operation, 'empleado', error.error?.message);
        }
      });
    } else {
      this.notificationService.validationError('Por favor, completa todos los campos requeridos correctamente.');
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  generateEmployeeCode(): string {
    const timestamp = Date.now().toString().slice(-4);
    return `EMP${timestamp}`;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('invalidName')) {
      return field.errors?.['invalidName'];
    }
    if (field.hasError('multipleSpaces')) {
      return field.errors?.['multipleSpaces'];
    }
    if (field.hasError('invalidDni')) {
      return field.errors?.['invalidDni'];
    }
    if (field.hasError('invalidPhone')) {
      return field.errors?.['invalidPhone'];
    }
    if (field.hasError('invalidEmail')) {
      return field.errors?.['invalidEmail'];
    }
    if (field.hasError('email')) {
      return 'Email inválido';
    }
    if (field.hasError('invalidPrice')) {
      return field.errors?.['invalidPrice'];
    }
    if (field.hasError('futureDate')) {
      return field.errors?.['futureDate'];
    }
    if (field.hasError('tooOld')) {
      return field.errors?.['tooOld'];
    }
    if (field.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    if (field.hasError('min')) {
      const min = field.errors?.['min']?.min;
      if (fieldName === 'salary') return `El salario mínimo es S/${min}`;
      return `El valor debe ser mayor a ${min}`;
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Ingrese un email válido';
      if (field.errors['pattern']) {
        if (fieldName === 'dni') return 'DNI debe tener 8 dígitos';
        if (fieldName === 'phone') return 'Teléfono debe tener 9 dígitos';
      }
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      surname: 'Apellido',
      dni: 'DNI',
      phone: 'Teléfono',
      email: 'Email',
      address: 'Dirección',
      positionName: 'Cargo',
      salary: 'Salario',
      hireDate: 'Fecha de contratación'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  getFullName(): string {
    const name = this.employeeForm.get('name')?.value || '';
    const surname = this.employeeForm.get('surname')?.value || '';
    return `${name} ${surname}`.trim();
  }
}