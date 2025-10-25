import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService, LoginRequest } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>DeliPedidos</h1>
          <p>Iniciar Sesión</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput formControlName="username" placeholder="Ingresa tu usuario">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Ingresa tu contraseña">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="login-button"
            [disabled]="loginForm.invalid || loading">
            @if (loading) {
              <mat-spinner diameter="20"></mat-spinner>
            }
            @if (!loading) {
              <span>Iniciar Sesión</span>
            }
          </button>
        </form>

        <div class="demo-credentials">
          <p><strong>Credenciales del backend:</strong></p>
          <p>Usuario: admin | Contraseña: admin123</p>
          <p><small>Conectado a: localhost:8085</small></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #7c1d3b, #a02851);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #7c1d3b;
      margin: 0 0 8px 0;
    }

    .login-header p {
      color: #6c757d;
      font-size: 16px;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .login-button {
      background-color: #7c1d3b;
      color: white;
      padding: 12px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 16px;
    }

    .login-button:hover:not(:disabled) {
      background-color: #6a1830;
    }

    .demo-credentials {
      margin-top: 24px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
    }

    .demo-credentials p {
      margin: 4px 0;
    }
  `]
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLogin(): void {
        if (this.loginForm.valid) {
            this.loading = true;
            const credentials: LoginRequest = this.loginForm.value;

            this.authService.login(credentials).subscribe({
                next: (response) => {
                    this.loading = false;
                    Swal.fire({
                        title: 'Bienvenido',
                        text: `Hola ${response.username}!`,
                        icon: 'success',
                        confirmButtonColor: '#7c1d3b'
                    });
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Login error:', error);
                    Swal.fire({
                        title: 'Error de autenticación',
                        text: 'Usuario o contraseña incorrectos',
                        icon: 'error',
                        confirmButtonColor: '#7c1d3b'
                    });
                }
            });
        }
    }
}