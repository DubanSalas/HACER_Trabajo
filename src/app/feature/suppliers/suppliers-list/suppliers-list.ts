import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { SupplierDTO, SupplierSummary } from '../../../core/interfaces/suppliers-interfaces';
import { NotificationService } from '../../../core/services/notification.service';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';
import { AdvancedFilterComponent } from '../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AdvancedFilterComponent],
  templateUrl: './suppliers-list.html',
  styleUrls: ['./suppliers-list.scss']
})
export class SuppliersListComponent implements OnInit {
  suppliers: SupplierDTO[] = [];
  filteredSuppliers: SupplierDTO[] = [];
  summary: SupplierSummary | null = null;
  loading = false;
  filterConfig: FilterConfig;
  searchTerm = '';

  // Filtros
  statusOptions = [
    { value: 'A', label: 'Activos' },
    { value: 'S', label: 'Suspendidos' },
    { value: 'I', label: 'Inactivos' },
    { value: '', label: 'Todos' }
  ];

  categories: string[] = [];

  // Detail modal properties
  showDetailModal = false;
  selectedSupplier: SupplierDTO | null = null;

  constructor(
    private suppliersService: SuppliersService,
    private router: Router,
    private notificationService: NotificationService,
    private filterService: FilterService
  ) {
    this.filterConfig = this.filterService.getSupplierFilterConfig();
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadSummary();
    // Agregar datos de prueba si no hay datos del backend
    this.addMockDataIfEmpty();
  }

  addMockDataIfEmpty(): void {
    // Datos de prueba para mostrar el diseño
    if (this.suppliers.length === 0) {
      setTimeout(() => {
        if (this.suppliers.length === 0) {
          this.suppliers = [
            {
              idSupplier: 1,
              companyName: 'Distribuidora San Martín S.A.C.',
              contactName: 'Carlos Mendoza',
              phone: '987654321',
              email: 'carlos@sanmartin.com',
              address: 'Av. Industrial 123, Lima',
              category: 'Harinas y Cereales',
              paymentTerms: '30 días',
              locationId: 1,
              department: 'Lima',
              province: 'Lima',
              district: 'San Martín de Porres',
              locationAddress: 'Av. Industrial 123',
              status: 'A'
            },
            {
              idSupplier: 2,
              companyName: 'Lácteos del Norte E.I.R.L.',
              contactName: 'María González',
              phone: '976543210',
              email: 'maria@lacteosn.com',
              address: 'Jr. Los Lácteos 456, Trujillo',
              category: 'Productos Lácteos',
              paymentTerms: '15 días',
              locationId: 2,
              department: 'La Libertad',
              province: 'Trujillo',
              district: 'Trujillo',
              locationAddress: 'Jr. Los Lácteos 456',
              status: 'A'
            },
            {
              idSupplier: 3,
              companyName: 'Empaques Premium S.A.',
              contactName: 'José Rodríguez',
              phone: '965432109',
              email: 'jose@empaquespremium.com',
              address: 'Calle Empaques 789, Arequipa',
              category: 'Empaques y Envases',
              paymentTerms: '45 días',
              locationId: 3,
              department: 'Arequipa',
              province: 'Arequipa',
              district: 'Arequipa',
              locationAddress: 'Calle Empaques 789',
              status: 'S'
            }
          ];
          this.summary = {
            totalSuppliers: 3,
            activeSuppliers: 2,
            suspendedSuppliers: 1,
            inactiveSuppliers: 0
          };
          this.extractCategories();
          this.applyFilters();
        }
      }, 2000);
    }
  }

  loadSuppliers(): void {
    this.loading = true;
    console.log('Loading suppliers...');
    this.suppliersService.getAll().subscribe({
      next: (data: SupplierDTO[]) => {
        console.log('Suppliers loaded:', data);
        this.suppliers = data || [];
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading suppliers:', error);
        this.suppliers = [];
        this.filteredSuppliers = [];
        this.loading = false;
      }
    });
  }

  loadSummary(): void {
    console.log('Loading suppliers summary...');
    this.suppliersService.getSummary().subscribe({
      next: (data: SupplierSummary) => {
        console.log('Suppliers summary loaded:', data);
        this.summary = data;
      },
      error: (error: any) => {
        console.error('Error loading summary:', error);
        // Crear un summary por defecto si hay error
        this.summary = {
          totalSuppliers: this.suppliers.length,
          activeSuppliers: this.suppliers.filter(s => s.status === 'A').length,
          suspendedSuppliers: this.suppliers.filter(s => s.status === 'S').length,
          inactiveSuppliers: this.suppliers.filter(s => s.status === 'I').length
        };
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.suppliers.map(s => s.category));
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    // Usar el FilterService para aplicar filtros
    this.filteredSuppliers = this.filterService.applyFilters(this.suppliers, this.filterConfig);
  }

  // Método para manejar cambios en filtros avanzados
  onFiltersChanged(event: any): void {
    this.searchTerm = event.searchTerm || '';
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'A':
        return 'active';
      case 'S':
        return 'suspended';
      case 'I':
        return 'inactive';
      default:
        return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'A':
        return 'Activo';
      case 'S':
        return 'Suspendido';
      case 'I':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  }

  viewSupplier(supplier: SupplierDTO): void {
    this.selectedSupplier = supplier;
    this.showDetailModal = true;
  }

  editSupplier(supplier: SupplierDTO): void {
    this.router.navigate(['/suppliers/edit', supplier.idSupplier]);
  }

  deleteSupplier(supplier: SupplierDTO): void {
    if (confirm(`¿Estás seguro de que deseas desactivar al proveedor "${supplier.companyName}"?`)) {
      this.suppliersService.delete(supplier.idSupplier!).subscribe({
        next: () => {
          this.notificationService.supplierDeactivated(supplier.companyName);
          this.loadSuppliers();
        },
        error: (error: any) => {
          console.error('Error deleting supplier:', error);
          this.notificationService.operationError('desactivar', 'proveedor', error.error?.message);
        }
      });
    }
  }

  restoreSupplier(supplier: SupplierDTO): void {
    if (confirm(`¿Estás seguro de que deseas reactivar al proveedor "${supplier.companyName}"?`)) {
      this.suppliersService.restore(supplier.idSupplier!).subscribe({
        next: () => {
          this.notificationService.supplierRestored(supplier.companyName);
          this.loadSuppliers();
        },
        error: (error: any) => {
          console.error('Error restoring supplier:', error);
          this.notificationService.operationError('reactivar', 'proveedor', error.error?.message);
        }
      });
    }
  }

  generateReport(supplier?: SupplierDTO): void {
    if (supplier) {
      console.log('Generating report for supplier:', supplier);
      // TODO: Implementar reporte individual
    } else {
      this.suppliersService.generatePdfReport().subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte-proveedores.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Error generating report:', error);
        }
      });
    }
  }

  trackBySupplierId(_index: number, supplier: SupplierDTO): number {
    return supplier.idSupplier!;
  }

  clearFilters(): void {
    this.filterService.clearFilters();
    this.applyFilters();
  }

  refreshData(): void {
    this.loadSuppliers();
    this.loadSummary();
  }

  // Navigation methods
  navigateToCreate(): void {
    this.router.navigate(['/suppliers/create']);
  }

  getSupplierInitials(companyName: string): string {
    const words = companyName.split(' ');
    return words.length >= 2 ?
      (words[0].charAt(0) + words[1].charAt(0)).toUpperCase() :
      companyName.charAt(0).toUpperCase();
  }

  toggleStatus(supplier: SupplierDTO): void {
    const newStatus = supplier.status === 'A' ? 'I' : 'A';
    const action = newStatus === 'A' ? 'activar' : 'desactivar';

    if (confirm(`¿Está seguro de ${action} al proveedor ${supplier.companyName}?`)) {
      // TODO: Implementar cambio de estado
      console.log(`Toggle status for supplier:`, supplier);
    }
  }

  viewHistory(supplier: SupplierDTO): void {
    console.log('View history for supplier:', supplier);
    // TODO: Implementar historial de proveedor
  }

  // Detail modal methods
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSupplier = null;
  }

  editFromModal(): void {
    if (this.selectedSupplier && this.selectedSupplier.idSupplier) {
      this.closeDetailModal();
      this.editSupplier(this.selectedSupplier);
    }
  }

  deleteFromModal(): void {
    if (this.selectedSupplier) {
      this.deleteSupplier(this.selectedSupplier);
      this.closeDetailModal();
    }
  }

  restoreFromModal(): void {
    if (this.selectedSupplier) {
      this.restoreSupplier(this.selectedSupplier);
      this.closeDetailModal();
    }
  }

  generateSupplierReport(supplier: SupplierDTO): void {
    console.log('Generating individual report for supplier:', supplier);
    this.notificationService.info(`Generando reporte para "${supplier.companyName}"`);
  }

  sendEmail(supplier: SupplierDTO): void {
    if (supplier.email) {
      window.open(`mailto:${supplier.email}?subject=Contacto desde DeliciousBakery`, '_blank');
    }
  }

  callPhone(supplier: SupplierDTO): void {
    if (supplier.phone) {
      window.open(`tel:${supplier.phone}`, '_blank');
    }
  }
}