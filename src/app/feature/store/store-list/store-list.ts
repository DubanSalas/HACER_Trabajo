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

import { StoreService } from '../../../core/services/store.service';
import { SuppliersService } from '../../../core/services/suppliers.service';
import { StoreItem, StoreStats, StoreFilters } from '../../../core/interfaces/store-interfaces';
import { Supplier } from '../../../core/interfaces/suppliers-interfaces';
import { StoreFormComponent } from '../store-form/store-form';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    StoreFormComponent
  ],
  templateUrl: './store-list.html',
  styleUrls: ['./store-list.scss']
})
export class StoreListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  storeItems: StoreItem[] = [];
  filteredItems: StoreItem[] = [];
  suppliers: Supplier[] = [];
  stats: StoreStats = {
    total_products: 0,
    low_stock: 0,
    out_of_stock: 0,
    expiring_soon: 0,
    total_value: 0
  };

  loading = false;
  searchTerm = '';
  viewMode: 'list' | 'grid' = 'list';
  showForm = false;
  selectedItem: StoreItem | null = null;

  // Filtros
  filters: StoreFilters = {
    category: '',
    status: '',
    supplier: ''
  };

  categories: string[] = [];
  statuses: string[] = [];

  constructor(
    private storeService: StoreService,
    private suppliersService: SuppliersService
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
    this.loadStoreItems();
    this.loadStats();
    this.loadSuppliers();
    this.loadCategories();
    this.loadStatuses();
  }

  private subscribeToServices(): void {
    this.storeService.storeItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.storeItems = items;
        this.applyFilters();
      });

    this.storeService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);

    this.storeService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  private loadStoreItems(): void {
    this.storeService.getStoreItems().subscribe({
      error: (error) => {
        console.error('Error loading store items:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los productos del almacén',
          icon: 'error',
          confirmButtonColor: '#7c1d3b'
        });
      }
    });
  }

  private loadStats(): void {
    this.storeService.getStats().subscribe({
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  private loadSuppliers(): void {
    this.suppliersService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers = suppliers,
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  private loadCategories(): void {
    this.categories = this.storeService.getCategories();
  }

  private loadStatuses(): void {
    this.statuses = this.storeService.getStatuses();
  }

  applyFilters(): void {
    let filtered = [...this.storeItems];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.supplier_name?.toLowerCase().includes(term)
      );
    }

    // Filtros específicos
    if (this.filters.category) {
      filtered = filtered.filter(item => item.category === this.filters.category);
    }

    if (this.filters.status) {
      filtered = filtered.filter(item => item.status === this.filters.status);
    }

    if (this.filters.supplier) {
      filtered = filtered.filter(item => item.supplier_name === this.filters.supplier);
    }

    this.filteredItems = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      category: '',
      status: '',
      supplier: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  openCreateForm(): void {
    this.selectedItem = null;
    this.showForm = true;
  }

  openEditForm(item: StoreItem): void {
    this.selectedItem = item;
    this.showForm = true;
  }

  viewItem(item: StoreItem): void {
    const expiryDate = new Date(item.expiry_date);
    const isExpiringSoon = this.isExpiringSoon(item.expiry_date);
    const isExpired = expiryDate < new Date();

    Swal.fire({
      title: `${item.product_name}`,
      html: `
        <div class="store-item-details">
          <p><strong>Categoría:</strong> ${item.category}</p>
          <p><strong>Stock Actual:</strong> ${item.current_stock} ${item.unit}</p>
          <p><strong>Stock Mínimo:</strong> ${item.min_stock} ${item.unit}</p>
          <p><strong>Precio Unitario:</strong> S/ ${item.unit_price.toFixed(2)}</p>
          <p><strong>Proveedor:</strong> ${item.supplier_name || 'N/A'}</p>
          <p><strong>Fecha de Vencimiento:</strong> ${this.formatDate(item.expiry_date)}</p>
          <p><strong>Ubicación:</strong> ${item.location}</p>
          <p><strong>Estado:</strong> <span class="status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></p>
          <p><strong>Valor Total:</strong> S/ ${(item.current_stock * item.unit_price).toFixed(2)}</p>
          ${isExpired ? '<p style="color: #dc3545;"><strong>⚠️ PRODUCTO VENCIDO</strong></p>' : ''}
          ${isExpiringSoon && !isExpired ? '<p style="color: #ffc107;"><strong>⚠️ PRÓXIMO A VENCER</strong></p>' : ''}
        </div>
      `,
      width: '500px',
      confirmButtonColor: '#7c1d3b'
    });
  }

  deleteItem(item: StoreItem): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar "${item.product_name}" del almacén?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c1d3b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.storeService.deleteStoreItem(item.id_store).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El producto ha sido eliminado del almacén',
              icon: 'success',
              confirmButtonColor: '#7c1d3b'
            });
          },
          error: (error) => {
            console.error('Error deleting store item:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el producto',
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
    this.selectedItem = null;
  }

  onFormSuccess(): void {
    this.showForm = false;
    this.selectedItem = null;
    this.loadStoreItems();
    this.loadStats();
    this.loadCategories();
  }

  getSupplierName(id: number): string {
    const supplier = this.suppliers.find(s => s.id_Supplier === id);
    return supplier ? supplier.Company_Name : 'N/A';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponible': return 'status-available';
      case 'Agotado': return 'status-out-of-stock';
      case 'Próximo a Vencer': return 'status-expiring';
      case 'Vencido': return 'status-expired';
      case 'En Revisión': return 'status-review';
      default: return '';
    }
  }

  getStockClass(item: StoreItem): string {
    if (item.current_stock === 0) return 'stock-out';
    if (item.current_stock <= item.min_stock) return 'stock-low';
    return 'stock-normal';
  }

  isLowStock(item: StoreItem): boolean {
    return item.current_stock <= item.min_stock && item.current_stock > 0;
  }

  isOutOfStock(item: StoreItem): boolean {
    return item.current_stock === 0;
  }

  isExpiringSoon(expiryDate: string): boolean {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expiry <= sevenDaysFromNow && expiry >= today;
  }

  isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
  }

  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE');
  }

  formatStock(stock: number, unit: string): string {
    return `${stock} ${unit}`;
  }
}