import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './customer-register.html',
  styleUrls: ['./customer-register.scss']
})
export class CustomerRegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  documentTypes = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PAS', label: 'Pasaporte' }
  ];

  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{8,12}$/),
        Validators.minLength(8),
        Validators.maxLength(12)
      ]],
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      surname: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      dateBirth: ['', [Validators.required, this.ageValidator.bind(this)]],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^9[0-9]{8}$/),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(20),
        this.passwordStrengthValidator.bind(this)
      ]],
      confirmPassword: ['', Validators.required],
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    }, { validators: this.passwordMatchValidator });

    this.loadDepartments();
    this.setupLocationListeners();
  }

  loadDepartments(): void {
    this.http.get<string[]>(`${environment.urlBackEnd}/api/locations/departments`)
      .subscribe({
        next: (data) => {
          this.departments = data;
        },
        error: (error) => {
          console.error('Error al cargar departamentos:', error);
          this.snackBar.open('Error al cargar departamentos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  setupLocationListeners(): void {
    // Cuando cambia el departamento, cargar provincias
    this.registerForm.get('department')?.valueChanges.subscribe(department => {
      if (department) {
        this.loadProvinces(department);
        // Limpiar provincia y distrito
        this.registerForm.patchValue({ province: '', district: '' });
        this.provinces = [];
        this.districts = [];
      }
    });

    // Cuando cambia la provincia, cargar distritos
    this.registerForm.get('province')?.valueChanges.subscribe(province => {
      if (province) {
        this.loadDistricts(province);
        // Limpiar distrito
        this.registerForm.patchValue({ district: '' });
        this.districts = [];
      }
    });
  }

  loadProvinces(department: string): void {
    this.http.get<string[]>(`${environment.urlBackEnd}/api/locations/provinces`, {
      params: { department }
    }).subscribe({
      next: (data) => {
        this.provinces = data;
      },
      error: (error) => {
        console.error('Error al cargar provincias:', error);
        this.snackBar.open('Error al cargar provincias', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadDistricts(province: string): void {
    this.http.get<string[]>(`${environment.urlBackEnd}/api/locations/districts`, {
      params: { province }
    }).subscribe({
      next: (data) => {
        this.districts = data;
      },
      error: (error) => {
        console.error('Error al cargar distritos:', error);
        this.snackBar.open('Error al cargar distritos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Validador de edad mínima (18 años)
  ageValidator(control: any) {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return { underAge: true };
    }
    
    if (age > 120) {
      return { invalidAge: true };
    }
    
    return null;
  }

  // Validador de fortaleza de contraseña
  passwordStrengthValidator(control: any) {
    if (!control.value) return null;
    
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber;
    
    if (!valid) {
      return { weakPassword: true };
    }
    
    return null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.registerForm.value;

    const registrationData = {
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      name: formData.name,
      surname: formData.surname,
      dateBirth: formData.dateBirth,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      location: {
        department: formData.department,
        province: formData.province,
        district: formData.district,
        address: formData.address
      }
    };

    this.http.post(`${environment.urlBackEnd}/v1/api/auth/register/customer`, registrationData)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.snackBar.open('¡Registro exitoso! Ya puedes iniciar sesión', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          setTimeout(() => {
            this.router.navigate(['/auth/customer-login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.error || 'Error al registrar. Inténtalo nuevamente.';
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/auth/customer-login']);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('email')) {
      return 'Ingresa un email válido (ejemplo@correo.com)';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    
    if (control?.hasError('pattern')) {
      if (field === 'documentNumber') return 'Documento debe tener entre 8 y 12 dígitos';
      if (field === 'phone') return 'Teléfono debe iniciar con 9 y tener 9 dígitos';
      if (field === 'name' || field === 'surname') return 'Solo se permiten letras y espacios';
      if (field === 'email') return 'Formato de email inválido';
    }
    
    if (control?.hasError('underAge')) {
      return 'Debes ser mayor de 18 años para registrarte';
    }
    
    if (control?.hasError('invalidAge')) {
      return 'Fecha de nacimiento inválida';
    }
    
    if (control?.hasError('weakPassword')) {
      return 'La contraseña debe contener mayúsculas, minúsculas y números';
    }
    
    if (control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  }

  // Método para obtener hints de ayuda
  getPasswordHint(): string {
    const password = this.registerForm.get('password')?.value || '';
    const hints: string[] = [];
    
    if (password.length < 8) hints.push('mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) hints.push('una mayúscula');
    if (!/[a-z]/.test(password)) hints.push('una minúscula');
    if (!/[0-9]/.test(password)) hints.push('un número');
    
    return hints.length > 0 ? `Falta: ${hints.join(', ')}` : 'Contraseña segura ✓';
  }

  // Método para verificar si el campo es válido
  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.valid && control?.touched);
  }

  // Método para verificar si el campo es inválido
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
