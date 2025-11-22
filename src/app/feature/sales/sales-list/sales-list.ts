import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SalesService } from '../../../core/services/sales.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaleDTO, SaleSummary } from '../../../core/interfaces/sales-interfaces';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';
import { AdvancedFilterComponent } from '../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AdvancedFilterComponent],
  templateUrl: './sales-list.html',
  styleUrls: ['./sales-list.scss']
})
export class SalesListComponent implements OnInit {
  sales: SaleDTO[] = [];
  filteredSales: SaleDTO[] = [];
  summary: SaleSummary | null = null;
  loading = false;
  filterConfig: FilterConfig;

  // Filtros
  statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  paymentMethods: string[] = [];

  constructor(
    private salesService: SalesService,
    private router: Router,
    private filterService: FilterService,
    private notificationService: NotificationService
  ) {
    this.filterConfig = this.filterService.getSalesFilterConfig();
  }

  ngOnInit(): void {
    this.loadSales();
    this.loadSummary();
  }

  loadSales(): void {
    this.loading = true;
    console.log('🔄 Cargando ventas desde Oracle...');
    this.salesService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Ventas cargadas desde Oracle:', data.length);
        this.sales = data;
        this.extractPaymentMethods();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar ventas desde Oracle:', error);
        this.loading = false;
        alert('Error al cargar ventas. Verifica que el backend esté corriendo.');
      }
    });
  }

  loadSummary(): void {
    this.salesService.getSummary().subscribe({
      next: (data) => {
        console.log('✅ Resumen de ventas cargado desde Oracle:', data);
        this.summary = data;
      },
      error: (error) => {
        console.error('❌ Error al cargar resumen de ventas:', error);
      }
    });
  }

  extractPaymentMethods(): void {
    const methodSet = new Set(this.sales.map(s => s.paymentMethod));
    this.paymentMethods = Array.from(methodSet).sort();
  }

  applyFilters(): void {
    // Inicialmente mostrar todas las ventas
    this.filteredSales = [...this.sales];
  }

  // Método para manejar cambios en filtros avanzados
  onFiltersChanged(filters: any): void {
    console.log('Filters changed:', filters);

    // Aplicar filtros manualmente
    this.filteredSales = this.sales.filter(sale => {
      // Filtro por término de búsqueda
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesSearch =
          sale.saleCode?.toLowerCase().includes(searchTerm) ||
          sale.customerFullName?.toLowerCase().includes(searchTerm) ||
          sale.employeeFullName?.toLowerCase().includes(searchTerm) ||
          sale.paymentMethod?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (filters.status && filters.status !== '') {
        if (sale.status !== filters.status) return false;
      }

      return true;
    });

    console.log('Filtered sales:', this.filteredSales.length, 'of', this.sales.length);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'status-completed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch (method.toLowerCase()) {
      case 'efectivo':
        return '💵';
      case 'tarjeta':
        return '💳';
      case 'yape':
        return '📱';
      case 'plin':
        return '📲';
      default:
        return '💰';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  formatCurrency(amount: number): string {
    return this.formatPrice(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  }

  viewSale(sale: SaleDTO): void {
    this.router.navigate(['/sales/detail', sale.idSale]);
  }

  viewSaleDetails(sale: SaleDTO): void {
    this.router.navigate(['/sales/detail', sale.idSale]);
  }

  editSale(sale: SaleDTO): void {
    this.router.navigate(['/sales/edit', sale.idSale]);
  }

  cancelSale(sale: SaleDTO): void {
    if (confirm(`¿Estás seguro de que deseas cancelar la venta ${sale.saleCode}?`)) {
      this.salesService.delete(sale.idSale).subscribe({
        next: () => {
          this.notificationService.saleCancelled(sale.saleCode);
          this.loadSales();
        },
        error: (error: any) => {
          console.error('Error cancelling sale:', error);
          this.notificationService.operationError('cancelar', 'venta', error.error?.message);
        }
      });
    }
  }

  deleteSale(sale: SaleDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la venta ${sale.saleCode}?`)) {
      this.salesService.delete(sale.idSale).subscribe({
        next: () => {
          this.notificationService.saleCancelled(sale.saleCode);
          this.loadSales();
        },
        error: (error: any) => {
          console.error('Error deleting sale:', error);
          this.notificationService.operationError('eliminar', 'venta', error.error?.message);
        }
      });
    }
  }

  restoreSale(sale: SaleDTO): void {
    if (confirm(`¿Estás seguro de que deseas restaurar la venta ${sale.saleCode}?`)) {
      // Implementar lógica de restauración cuando esté disponible en el backend
      this.salesService.restore(sale.idSale).subscribe({
        next: () => {
          this.notificationService.saleRestored(sale.saleCode);
          this.loadSales();
        },
        error: (error: any) => {
          console.error('Error restoring sale:', error);
          this.notificationService.operationError('restaurar', 'venta', error.error?.message);
        }
      });
    }
  }

  generateReport(): void {
    this.salesService.generatePdfReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-ventas.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  trackBySaleId(index: number, sale: SaleDTO): number {
    return sale.idSale;
  }

  viewReceipt(sale: SaleDTO): void {
    this.router.navigate(['/sales/receipt', sale.idSale]);
  }

  printReceipt(sale: SaleDTO): void {
    // Navegar a la boleta con parámetro de impresión automática
    this.router.navigate(['/sales/receipt', sale.idSale], {
      queryParams: { print: 'true' }
    });
  }

  duplicateSale(sale: SaleDTO): void {
    console.log('Duplicate sale:', sale);
    // TODO: Implementar duplicación de venta
  }

  viewHistory(sale: SaleDTO): void {
    console.log('View history for sale:', sale);
    // TODO: Implementar historial de venta
  }

  clearFilters(): void {
    this.filterService.clearFilters();
    this.applyFilters();
  }

  refreshData(): void {
    this.loadSales();
    this.loadSummary();
  }

  refreshSales(): void {
    this.loading = true;
    this.loadSales();
  }

  // Método para filtrar directamente por estado
  filterByStatus(status: string): void {
    console.log('Filtering by status:', status);
    this.filteredSales = status === ''
      ? [...this.sales]
      : this.sales.filter(sale => sale.status === status);
    console.log('Filtered results:', this.filteredSales.length);
  }

  // Navigation methods
  navigateToCreate(): void {
    this.router.navigate(['/sales/create']);
  }
}