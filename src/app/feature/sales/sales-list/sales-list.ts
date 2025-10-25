import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { SalesService } from '../../../core/services/sales.service';
import { CustomerService } from '../../../core/services/customer.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { SaleWithDetails, SaleStats, SaleFilters } from '../../../core/interfaces/sales-interfaces';
import { Customer } from '../../../core/interfaces/customer-interfaces';
import { Employee } from '../../../core/interfaces/employees-interfaces';
import { SalesFormComponent } from '../sales-form/sales-form';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    SalesFormComponent
  ],
  templateUrl: './sales-list.html',
  styleUrls: ['./sales-list.scss']
})
export class SalesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  sales: SaleWithDetails[] = [];
  filteredSales: SaleWithDetails[] = [];
  customers: Customer[] = [];
  employees: Employee[] = [];
  stats: SaleStats = {
    ventas_totales: 0,
    ventas_hoy: 0,
    completadas: 0,
    pendientes: 0,
    total_ventas: 0,
    total_hoy: 0
  };

  loading = false;
  searchTerm = '';
  viewMode: 'list' | 'grid' = 'list';
  showForm = false;
  selectedSale: SaleWithDetails | null = null;

  // Filtros
  filters: SaleFilters = {
    estado: '',
    metodo_pago: '',
    fecha_inicio: '',
    fecha_fin: ''
  };

  estados = ['Pendiente', 'Completado', 'Cancelado'];
  metodosPago = ['Efectivo', 'Tarjeta', 'Transferencia'];

  constructor(
    private salesService: SalesService,
    private customersService: CustomerService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.subscribeToServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.loadSales();
    this.loadStats();
    this.loadCustomers();
    this.loadEmployees();
  }

  private subscribeToServices(): void {
    this.salesService.sales$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sales => {
        this.sales = sales;
        this.applyFilters();
      });

    this.salesService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);

    this.salesService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  private loadSales(): void {
    this.salesService.getSales().subscribe({
      error: (error) => {
        console.error('Error loading sales:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las ventas',
          icon: 'error',
          confirmButtonColor: '#7c1d3b'
        });
      }
    });
  }

  private loadStats(): void {
    this.salesService.getStats().subscribe({
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  private loadCustomers(): void {
    this.customersService.getCustomers().subscribe({
      next: (customers: Customer[]) => this.customers = customers,
      error: (error: any) => console.error('Error loading customers:', error)
    });
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => this.employees = employees,
      error: (error) => console.error('Error loading employees:', error)
    });
  }

  applyFilters(): void {
    let filtered = [...this.sales];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.id_venta.toString().includes(term) ||
        this.getCustomerName(sale.idCustomer).toLowerCase().includes(term) ||
        this.getEmployeeName(sale.id_Employee).toLowerCase().includes(term)
      );
    }

    // Filtros específicos
    if (this.filters.estado) {
      filtered = filtered.filter(sale => sale.estado === this.filters.estado);
    }

    if (this.filters.metodo_pago) {
      filtered = filtered.filter(sale => sale.metodo_pago === this.filters.metodo_pago);
    }

    if (this.filters.fecha_inicio) {
      filtered = filtered.filter(sale => sale.fecha_venta >= this.filters.fecha_inicio!);
    }

    if (this.filters.fecha_fin) {
      filtered = filtered.filter(sale => sale.fecha_venta <= this.filters.fecha_fin!);
    }

    this.filteredSales = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      estado: '',
      metodo_pago: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  openCreateForm(): void {
    this.selectedSale = null;
    this.showForm = true;
  }

  openEditForm(sale: SaleWithDetails): void {
    this.selectedSale = sale;
    this.showForm = true;
  }

  viewSale(sale: SaleWithDetails): void {
    const detallesHtml = sale.detalles.map(detalle => `
      <tr>
        <td>Producto ${detalle.id_Product}</td>
        <td>${detalle.cantidad}</td>
        <td>S/ ${detalle.precio_unitario.toFixed(2)}</td>
        <td>S/ ${detalle.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    Swal.fire({
      title: `Venta ${sale.id_venta}`,
      html: `
        <div class="sale-details">
          <p><strong>Cliente:</strong> ${sale.cliente_nombre || 'N/A'}</p>
          <p><strong>Empleado:</strong> ${sale.empleado_nombre || 'N/A'}</p>
          <p><strong>Fecha:</strong> ${new Date(sale.fecha_venta).toLocaleDateString()}</p>
          <p><strong>Método de Pago:</strong> ${sale.metodo_pago}</p>
          <p><strong>Estado:</strong> ${sale.estado}</p>
          <p><strong>Total:</strong> S/ ${sale.total.toFixed(2)}</p>
          
          <h4>Detalles de Productos:</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Precio</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${detallesHtml}
            </tbody>
          </table>
        </div>
      `,
      width: '600px',
      confirmButtonColor: '#7c1d3b'
    });
  }

  deleteSale(sale: SaleWithDetails): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la venta ${sale.id_venta}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c1d3b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesService.deleteSale(sale.id_venta).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'La venta ha sido eliminada correctamente',
              icon: 'success',
              confirmButtonColor: '#7c1d3b'
            });
          },
          error: (error) => {
            console.error('Error deleting sale:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la venta',
              icon: 'error',
              confirmButtonColor: '#7c1d3b'
            });
          }
        });
      }
    });
  }

  onFormClose(): void {
    this.showForm = false;
    this.selectedSale = null;
  }

  onFormSuccess(): void {
    this.showForm = false;
    this.selectedSale = null;
    this.loadSales();
    this.loadStats();
  }

  getCustomerName(id: number): string {
    const customer = this.customers.find(c => c.idCustomer === id);
    return customer ? `${customer.name} ${customer.surname}` : 'N/A';
  }

  getEmployeeName(id: number): string {
    const employee = this.employees.find(e => e.id_Employee === id);
    return employee ? `${employee.Name} ${employee.Surname}` : 'N/A';
  }

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Completado': return 'status-completed';
      case 'Pendiente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      default: return '';
    }
  }

  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE');
  }
}