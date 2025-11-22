import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-login',
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
    MatSnackBarModule
  ],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.scss']
})
export class CustomerLoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(20)
      ]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        const role = this.authService.getUserRole();
        console.log('✅ Rol del usuario:', role);
        
        this.loading = false;
        
        // VALIDAR QUE SOLO CLIENTES PUEDAN ACCEDER AL PORTAL DE CLIENTE
        if (role === 'CLIENTE') {
          console.log('🔄 Redirigiendo a portal de cliente');
          this.router.navigate(['/customer/home']);
        } else if (role === 'ADMIN' || role === 'EMPLEADO') {
          console.log('❌ Usuario ADMIN/EMPLEADO intentando acceder al portal de cliente');
          this.snackBar.open('Esta cuenta es de administrador. Use el login de administradores.', 'Cerrar', { 
            duration: 4000 
          });
          this.authService.logout();
        } else {
          console.log('❌ Rol no válido:', role);
          this.snackBar.open('Esta cuenta no es de cliente', 'Cerrar', { duration: 3000 });
          this.authService.logout();
        }
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.loading = false;
        const errorMessage = error.status === 401 
          ? 'Email o contraseña incorrectos' 
          : 'Error al iniciar sesión';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }

  onGuestAccess(): void {
    this.router.navigate(['/customer/home']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/customer-register']);
  }

  goBack(): void {
    this.router.navigate(['/auth/user-type']);
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return field === 'email' ? 'El email es requerido' : 'La contraseña es requerida';
    }
    
    if (control?.hasError('email')) {
      return 'Ingresa un email válido (ejemplo@correo.com)';
    }
    
    if (control?.hasError('pattern')) {
      return 'Formato de email inválido';
    }
    
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (control?.hasError('maxlength')) {
      return 'La contraseña no puede exceder 20 caracteres';
    }
    
    return '';
  }

  // Método para verificar si el campo es válido
  isFieldValid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.valid && control?.touched);
  }

  // Método para verificar si el campo es inválido
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}