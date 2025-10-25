import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer, CustomerSummary, CustomerFilters } from '../../../core/interfaces/customer-interfaces';
import { CustomerFormComponent } from '../customer-form/customer-form';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CustomerFormComponent
  ],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  stats: CustomerSummary = {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    newThisMonth: 0
  };

  loading = false;
  searchTerm = '';
  showForm = false;
  selectedCustomer: Customer | null = null;

  // Filtros
  filters: CustomerFilters = {
    status: 'A', // Por defecto mostrar activos
    department: '',
    province: '',
    district: ''
  };

  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];
  statuses = [
    { value: '', label: 'Todos' },
    { value: 'A', label: 'Activos' },
    { value: 'I', label: 'Inactivos' }
  ];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.subscribeToServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.loadCustomers();
    this.loadSummary();
  }

  private subscribeToServices(): void {
    this.customerService.customers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customers => {
        this.customers = customers;
        this.updateLocationFilters();
        this.applyFilters();
      });

    this.customerService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);

    this.customerService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  private loadCustomers(): void {
    console.log('🔄 Loading customers from backend...');
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        console.log('✅ Customers loaded from backend:', customers);
      },
      error: (error) => {
        console.error('❌ Error loading customers:', error);

        let errorMessage = 'No se pudo conectar con el backend';
        if (error.status === 403) {
          errorMessage = 'Error 403: Acceso denegado. Verifica la configuración de seguridad en el backend.';
        } else if (error.status === 404) {
          errorMessage = 'Error 404: Endpoint no encontrado. Verifica que el backend esté corriendo.';
        } else if (error.status === 0) {
          errorMessage = 'Error de CORS: El backend no permite peticiones desde el frontend.';
        }

        Swal.fire({
          title: 'Error de conexión',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#7c1d3b'
        });
      }
    });
  }



  private loadSummary(): void {
    console.log('🔄 Loading summary from backend...');
    this.customerService.getSummary().subscribe({
      next: (summary) => {
        console.log('✅ Summary loaded from backend:', summary);
      },
      error: (error) => {
        console.error('❌ Error loading summary:', error);
      }
    });
  }

  private updateLocationFilters(): void {
    this.departments = this.customerService.getDepartments();
    this.provinces = this.customerService.getProvinces();
    this.districts = this.customerService.getDistricts();
  }

  applyFilters(): void {
    let filtered = [...this.customers];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.surname.toLowerCase().includes(term) ||
        customer.clientCode.toLowerCase().includes(term) ||
        customer.documentNumber.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    }

    // Filtros específicos
    if (this.filters.status) {
      filtered = filtered.filter(customer => customer.status === this.filters.status);
    }

    if (this.filters.department) {
      filtered = filtered.filter(customer => customer.department === this.filters.department);
    }

    if (this.filters.province) {
      filtered = filtered.filter(customer => customer.province === this.filters.province);
    }

    if (this.filters.district) {
      filtered = filtered.filter(customer => customer.district === this.filters.district);
    }

    this.filteredCustomers = filtered;
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.customerService.searchCustomers(this.searchTerm, this.filters.status || 'A').subscribe({
        next: (customers) => {
          this.customers = customers;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error searching customers:', error);
          this.applyFilters();
        }
      });
    } else {
      this.applyFilters();
    }
  }

  onFilterChange(): void {
    if (this.filters.status) {
      this.customerService.getCustomersByStatus(this.filters.status).subscribe({
        next: (customers) => {
          this.customers = customers;
          this.updateLocationFilters();
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error filtering by status:', error);
          this.applyFilters();
        }
      });
    } else {
      this.applyFilters();
    }
  }

  clearFilters(): void {
    this.filters = {
      status: 'A',
      department: '',
      province: '',
      district: ''
    };
    this.searchTerm = '';
    this.loadCustomers();
  }

  openCreateForm(): void {
    this.selectedCustomer = null;
    this.showForm = true;
  }

  openEditForm(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showForm = true;
  }

  viewCustomer(customer: Customer): void {
    Swal.fire({
      title: `${customer.name} ${customer.surname}`,
      html: `
        <div class="customer-details">
          <p><strong>Código Cliente:</strong> ${customer.clientCode}</p>
          <p><strong>Documento:</strong> ${customer.documentType} - ${customer.documentNumber}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Teléfono:</strong> ${customer.phone}</p>
          <p><strong>Fecha de Nacimiento:</strong> ${this.formatDate(customer.dateBirth)}</p>
          <p><strong>Ubicación:</strong> ${customer.locationAddress}</p>
          <p><strong>Departamento:</strong> ${customer.department}</p>
          <p><strong>Provincia:</strong> ${customer.province}</p>
          <p><strong>Distrito:</strong> ${customer.district}</p>
          <p><strong>Fecha de Registro:</strong> ${this.formatDate(customer.registerDate || '')}</p>
          <p><strong>Estado:</strong> ${customer.status === 'A' ? 'Activo' : 'Inactivo'}</p>
        </div>
      `,
      width: '500px',
      confirmButtonColor: '#7c1d3b'
    });
  }

  deleteCustomer(customer: Customer): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente "${customer.name} ${customer.surname}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c1d3b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(customer.idCustomer!).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El cliente ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonColor: '#7c1d3b'
            });
            this.loadCustomers();
            this.loadSummary();
          },
          error: (error) => {
            console.error('Error deleting customer:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el cliente',
              icon: 'error',
              confirmButtonColor: '#7c1d3b'
            });
          }
        });
      }
    });
  }

  restoreCustomer(customer: Customer): void {
    Swal.fire({
      title: '¿Restaurar cliente?',
      text: `¿Deseas restaurar al cliente "${customer.name} ${customer.surname}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.restoreCustomer(customer.idCustomer!).subscribe({
          next: () => {
            Swal.fire({
              title: 'Restaurado',
              text: 'El cliente ha sido restaurado correctamente',
              icon: 'success',
              confirmButtonColor: '#7c1d3b'
            });
            this.loadCustomers();
            this.loadSummary();
          },
          error: (error) => {
            console.error('Error restoring customer:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo restaurar el cliente',
              icon: 'error',
              confirmButtonColor: '#7c1d3b'
            });
          }
        });
      }
    });
  }

  generateReport(): void {
    this.customerService.generatePdfReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reporte_clientes.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo generar el reporte',
          icon: 'error',
          confirmButtonColor: '#7c1d3b'
        });
      }
    });
  }

  onFormClose(): void {
    this.showForm = false;
    this.selectedCustomer = null;
  }

  onFormSuccess(): void {
    this.showForm = false;
    this.selectedCustomer = null;
    this.loadCustomers();
    this.loadSummary();
  }

  getStatusClass(status: string): string {
    return status === 'A' ? 'status-active' : 'status-inactive';
  }

  getStatusLabel(status: string): string {
    return status === 'A' ? 'Activo' : 'Inactivo';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-PE');
  }

  getFullName(customer: Customer): string {
    return `${customer.name} ${customer.surname}`;
  }

  getContactInfo(customer: Customer): string {
    return `${customer.email} / ${customer.phone}`;
  }

  getLocationInfo(customer: Customer): string {
    return `${customer.district}/${customer.province}/${customer.department}`;
  }
}