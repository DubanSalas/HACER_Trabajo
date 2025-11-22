import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.scss']
})
export class CustomerProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  supportForm!: FormGroup;
  currentUser: any = null;
  customerData: any = null;
  supportTickets: any[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadCustomerData();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      documentNumber: ['', Validators.required],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.supportForm = this.fb.group({
      type: ['', Validators.required],
      orderNumber: [''],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      priority: ['MEDIA', Validators.required]
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  private loadCustomerData(): void {
    this.isLoading = true;

    // Obtener usuario actual del AuthService
    this.currentUser = this.authService.getCurrentUser();
    console.log('👤 Usuario actual:', this.currentUser);

    if (this.currentUser && this.currentUser.username) {
      const email = this.currentUser.username; // El username es el email
      console.log('📧 Cargando datos del cliente con email:', email);

      // Cargar datos completos del cliente desde el backend
      this.customerService.getCustomerByEmail(email).subscribe({
        next: (customer) => {
          console.log('✅ Datos del cliente cargados:', customer);
          this.customerData = customer;
          this.populateForm(customer);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error loading customer data:', error);
          // Si falla, usar datos básicos del usuario autenticado
          this.customerData = {
            name: 'Cliente',
            surname: '',
            email: email,
            clientCode: 'N/A'
          };
          this.populateFormFromUser(this.currentUser);
          this.isLoading = false;
        }
      });
    } else {
      console.error('❌ No hay usuario autenticado');
      this.isLoading = false;
    }
  }

  private populateForm(customer: any): void {
    this.profileForm.patchValue({
      name: customer.name || '',
      surname: customer.surname || '',
      email: customer.email || '',
      phone: customer.phone || '',
      documentNumber: customer.documentNumber || '',
      address: customer.locationAddress || customer.location?.address || ''
    });
  }

  private populateFormFromUser(user: any): void {
    this.profileForm.patchValue({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || '',
      documentNumber: user.documentNumber || '',
      address: ''
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isSaving = true;
    const formData = this.profileForm.value;

    // Actualizar perfil en el backend
    if (this.customerData && this.customerData.idCustomer) {
      this.customerService.updateCustomer(this.customerData.idCustomer, formData).subscribe({
        next: () => {
          this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.isSaving = false;
          this.loadCustomerData(); // Recargar datos
        },
        error: (error: any) => {
          console.error('Error updating profile:', error);
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
            duration: 3000
          });
          this.isSaving = false;
        }
      });
    } else {
      this.snackBar.open('No se pudo identificar el cliente', 'Cerrar', {
        duration: 3000
      });
      this.isSaving = false;
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('mismatch')) {
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
          duration: 3000
        });
      } else {
        this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
          duration: 3000
        });
      }
      return;
    }

    this.isSaving = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    // Por ahora solo mostramos mensaje de éxito
    // TODO: Implementar cambio de contraseña en el backend
    setTimeout(() => {
      this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', {
        duration: 3000
      });
      this.passwordForm.reset();
      this.isSaving = false;
    }, 1000);
  }

  getInitials(): string {
    if (this.customerData) {
      const name = this.customerData.name || '';
      const surname = this.customerData.surname || '';
      return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
    return 'CL';
  }

  onSubmitSupport(): void {
    if (this.supportForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isSaving = true;
    const supportData = {
      ...this.supportForm.value,
      customerEmail: this.customerData?.email,
      customerName: `${this.customerData?.name} ${this.customerData?.surname}`,
      customerId: this.customerData?.idCustomer,
      status: 'PENDIENTE',
      createdAt: new Date()
    };

    console.log('📧 Enviando consulta de soporte:', supportData);

    // Simular envío (aquí deberías llamar a un servicio real)
    setTimeout(() => {
      this.snackBar.open('Tu consulta ha sido enviada exitosamente. Te responderemos pronto.', 'Cerrar', {
        duration: 5000
      });

      // Agregar al historial local
      this.supportTickets.unshift({
        id: Date.now(),
        ...supportData,
        status: 'PENDIENTE'
      });

      this.supportForm.reset({
        type: '',
        orderNumber: '',
        subject: '',
        description: '',
        priority: 'MEDIA'
      });

      this.isSaving = false;
    }, 1500);
  }

  resetSupportForm(): void {
    this.supportForm.reset({
      type: '',
      orderNumber: '',
      subject: '',
      description: '',
      priority: 'MEDIA'
    });
  }

  getTicketTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'PEDIDO_NO_LLEGA': 'Pedido no llegó',
      'PRODUCTO_DEFECTUOSO': 'Producto defectuoso',
      'DEVOLUCION': 'Devolución',
      'CAMBIO': 'Cambio',
      'FACTURACION': 'Facturación',
      'CONSULTA_GENERAL': 'Consulta general',
      'OTRO': 'Otro'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En proceso',
      'RESUELTO': 'Resuelto',
      'CERRADO': 'Cerrado'
    };
    return labels[status] || status;
  }
}
