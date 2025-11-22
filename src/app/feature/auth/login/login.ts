import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/interfaces/auth-interfaces';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginRequest = this.loginForm.value;
    console.log('Intentando login con:', credentials);

    this.loading = true;
    this.error = '';

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.loading = false;
        
        // Redirigir según el rol del usuario
        this.redirectToDashboard();
      },
      error: (error) => {
        console.error('❌ Error completo de login:', error);
        this.loading = false;

        if (error.status === 401) {
          this.error = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          this.error = 'No se puede conectar al servidor. Verifique que el backend esté funcionando.';
        } else {
          this.error = error.error?.message || `Error del servidor: ${error.status}`;
        }
      }
    });
  }

  redirectToDashboard(): void {
    // Verificar inmediatamente que los datos estén guardados
    const role = this.authService.getUserRole();
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();
    
    console.log('✅ Datos después del login:');
    console.log('- Rol:', role);
    console.log('- Usuario:', user);
    console.log('- Token:', token);
    
    if (!token) {
      console.error('❌ ERROR: No hay token después del login, esperando...');
      // Si no hay token, esperar un poco más
      setTimeout(() => this.redirectToDashboard(), 200);
      return;
    }
    
    // VALIDAR QUE SOLO ADMIN O EMPLEADO PUEDAN ACCEDER AL PANEL DE ADMINISTRACIÓN
    if (role === 'CLIENTE') {
      console.log('❌ Usuario CLIENTE intentando acceder al panel de admin');
      this.error = 'Esta cuenta es de cliente. Use el login de clientes.';
      this.authService.logout();
      this.loading = false;
      return;
    }
    
    // Verificar si hay una URL de redirección guardada
    const redirectUrl = this.authService.getRedirectUrl();
    
    if (redirectUrl) {
      console.log('🔄 Redirigiendo a URL guardada:', redirectUrl);
      this.authService.clearRedirectUrl();
      this.router.navigateByUrl(redirectUrl);
    } else if (role === 'ADMIN' || role === 'EMPLEADO') {
      console.log(`🔄 Redirigiendo a /dashboard (${role})`);
      this.router.navigate(['/dashboard']);
    } else {
      console.log('❌ Rol no válido para panel de administración');
      this.error = 'No tiene permisos para acceder al panel de administración';
      this.authService.logout();
      this.loading = false;
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field === 'username' ? 'Usuario' : 'Contraseña'} es requerido`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }
}