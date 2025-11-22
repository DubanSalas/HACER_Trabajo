import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { StoreService } from '../../../core/services/store.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StoreItemDTO, StoreItemSummary } from '../../../core/interfaces/store-interfaces';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';
import { AdvancedFilterComponent } from '../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AdvancedFilterComponent],
  templateUrl: './store-list.html',
  styleUrls: ['./store-list.scss']
})
export class StoreListComponent implements OnInit {
  storeItems: StoreItemDTO[] = [];
  filteredItems: StoreItemDTO[] = [];
  summary: StoreItemSummary | null = null;
  loading = false;
  filterConfig: FilterConfig;
  searchTerm = '';

  // Filtros
  statusOptions = [
    { value: 'A', label: 'Activos' },
    { value: 'I', label: 'Inactivos' },
    { value: '', label: 'Todos' }
  ];

  alertOptions = [
    { value: '', label: 'Todas las alertas' },
    { value: 'lowStock', label: 'Stock bajo' },
    { value: 'outOfStock', label: 'Sin stock' },
    { value: 'nearExpiry', label: 'Próximo a vencer' }
  ];

  categories: string[] = [];

  constructor(
    private storeService: StoreService,
    private router: Router,
    private filterService: FilterService,
    private notificationService: NotificationService
  ) {
    this.filterConfig = this.filterService.getStoreFilterConfig();
  }

  ngOnInit(): void {
    this.loadStoreItems();
    this.loadSummary();
    // Agregar datos de prueba si no hay datos del backend
    this.addMockDataIfEmpty();
  }

  addMockDataIfEmpty(): void {
    // Datos de prueba para mostrar el diseño
    if (this.storeItems.length === 0) {
      setTimeout(() => {
        if (this.storeItems.length === 0) {
          this.storeItems = [
            {
              idStoreItem: 1,
              itemCode: 'ALM001',
              productName: 'Harina Integral Premium',
              category: 'Harinas y Cereales',
              currentStock: 15,
              minimumStock: 20,
              unit: 'Kg',
              unitPrice: 8.50,
              supplierId: 1,
              supplierName: 'Distribuidora San Martín',
              expiryDate: '2024-12-31',
              location: 'Almacén Principal',
              status: 'A',
              totalStockValue: 127.50,
              nearExpiry: false,
              outOfStock: false,
              lowStock: true
            },
            {
              idStoreItem: 2,
              itemCode: 'ALM002',
              productName: 'Leche Entera',
              category: 'Productos Lácteos',
              currentStock: 0,
              minimumStock: 10,
              unit: 'Litros',
              unitPrice: 4.20,
              supplierId: 2,
              supplierName: 'Lácteos del Norte',
              expiryDate: '2024-11-15',
              location: 'Refrigerador',
              status: 'A',
              totalStockValue: 0,
              nearExpiry: true,
              outOfStock: true,
              lowStock: false
            },
            {
              idStoreItem: 3,
              itemCode: 'ALM003',
              productName: 'Cajas de Cartón',
              category: 'Empaques y Envases',
              currentStock: 50,
              minimumStock: 25,
              unit: 'Unidades',
              unitPrice: 1.50,
              supplierId: 3,
              supplierName: 'Empaques Premium',
              expiryDate: '2025-06-30',
              location: 'Bodega',
              status: 'A',
              totalStockValue: 75.00,
              nearExpiry: false,
              outOfStock: false,
              lowStock: false
            }
          ];
          this.summary = {
            totalItems: 3,
            availableItems: 3,
            outOfStockItems: 1,
            lowStockItems: 1,
            nearExpiryItems: 1,
            totalInventoryValue: 202.50
          };
          this.extractCategories();
          this.applyFilters();
        }
      }, 2000);
    }
  }

  loadStoreItems(): void {
    this.loading = true;
    console.log('Loading store items...');
    this.storeService.getAll().subscribe({
      next: (data) => {
        console.log('Store items loaded:', data);
        this.storeItems = data || [];
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading store items:', error);
        this.storeItems = [];
        this.filteredItems = [];
        this.loading = false;
      }
    });
  }

  loadSummary(): void {
    console.log('Loading store summary...');
    this.storeService.getSummary().subscribe({
      next: (data) => {
        console.log('Store summary loaded:', data);
        this.summary = data;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        // Crear un summary por defecto si hay error
        this.summary = {
          totalItems: this.storeItems.length,
          availableItems: this.storeItems.filter(item => item.status === 'A').length,
          outOfStockItems: this.storeItems.filter(item => item.outOfStock).length,
          lowStockItems: this.storeItems.filter(item => item.lowStock).length,
          nearExpiryItems: this.storeItems.filter(item => item.nearExpiry).length,
          totalInventoryValue: this.storeItems.reduce((sum, item) => sum + item.totalStockValue, 0)
        };
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.storeItems.map(item => item.category));
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    // Usar el FilterService para aplicar filtros
    this.filteredItems = this.filterService.applyFilters(this.storeItems, this.filterConfig);
  }

  // Método para manejar cambios en filtros avanzados
  onFiltersChanged(event: any): void {
    this.searchTerm = event.searchTerm || '';
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    return status === 'A' ? 'active' : 'inactive';
  }

  getStatusText(status: string): string {
    return status === 'A' ? 'Activo' : 'Inactivo';
  }

  getStockClass(item: StoreItemDTO): string {
    if (item.outOfStock) return 'stock-out';
    if (item.lowStock) return 'stock-low';
    return 'stock-normal';
  }

  getStockLabel(item: StoreItemDTO): string {
    if (item.outOfStock) return 'Sin stock';
    if (item.lowStock) return 'Stock bajo';
    return 'Stock normal';
  }

  getExpiryClass(item: StoreItemDTO): string {
    return item.nearExpiry ? 'expiry-warning' : 'expiry-normal';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  }

  viewItem(item: StoreItemDTO): void {
    this.router.navigate(['/store/edit', item.idStoreItem]);
  }

  editItem(item: StoreItemDTO): void {
    this.router.navigate(['/store/edit', item.idStoreItem]);
  }

  deleteItem(item: StoreItemDTO): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el item ${item.productName}?`)) {
      this.storeService.delete(item.idStoreItem).subscribe({
        next: () => {
          this.notificationService.storeItemDeactivated(item.productName);
          this.loadStoreItems();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.notificationService.operationError('eliminar', 'artículo de almacén', error.error?.message);
        }
      });
    }
  }

  restoreItem(item: StoreItemDTO): void {
    this.storeService.restore(item.idStoreItem).subscribe({
      next: () => {
        this.notificationService.storeItemRestored(item.productName);
        this.loadStoreItems();
      },
      error: (error) => {
        console.error('Error restoring item:', error);
        this.notificationService.operationError('restaurar', 'artículo de almacén', error.error?.message);
      }
    });
  }

  updateStock(item: StoreItemDTO): void {
    const newStock = prompt(`Ingrese el nuevo stock para ${item.productName}:`, item.currentStock.toString());
    if (newStock !== null && !isNaN(Number(newStock))) {
      this.storeService.updateStock(item.idStoreItem, Number(newStock)).subscribe({
        next: () => {
          this.notificationService.stockUpdated(item.productName, Number(newStock));
          this.loadStoreItems();
        },
        error: (error) => {
          console.error('Error updating stock:', error);
          this.notificationService.operationError('actualizar stock de', 'artículo', error.error?.message);
        }
      });
    }
  }

  generateReport(): void {
    this.storeService.generatePdfReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-almacen.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  trackByItemId(index: number, item: StoreItemDTO): number {
    return item.idStoreItem;
  }

  clearFilters(): void {
    this.filterService.clearFilters();
    this.applyFilters();
  }

  refreshData(): void {
    this.loadStoreItems();
    this.loadSummary();
  }

  // Navigation methods
  navigateToCreate(): void {
    this.router.navigate(['/store/create']);
  }
}