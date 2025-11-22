import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { ProductsService } from '../../../core/services/products.service';
import { ProductDTO, ProductSummary } from '../../../core/interfaces/products-interfaces';
import { NotificationService } from '../../../core/services/notification.service';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';
import { AdvancedFilterComponent } from '../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AdvancedFilterComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  summary: ProductSummary | null = null;
  loading = false;
  filterConfig: FilterConfig;
  searchTerm = '';

  // Detail modal properties
  showDetailModal = false;
  selectedProduct: ProductDTO | null = null;
  statusOptions = [
    { value: 'A', label: 'Activos' },
    { value: 'I', label: 'Inactivos' },
    { value: '', label: 'Todos' }
  ];

  categories: string[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private notificationService: NotificationService,
    private filterService: FilterService
  ) {
    this.filterConfig = this.filterService.getProductFilterConfig();
  }

  ngOnInit(): void {
    console.log('🔄 Cargando productos desde Oracle...');
    this.loadProducts();
    this.loadSummary();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Productos cargados desde Oracle:', data.length);
        this.products = data;
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar productos desde Oracle:', error);
        this.loading = false;
        alert('Error al cargar productos. Verifica que el backend esté corriendo.');
      }
    });
  }

  loadSummary(): void {
    this.productsService.getSummary().subscribe({
      next: (data) => {
        console.log('✅ Resumen de productos cargado desde Oracle:', data);
        this.summary = data;
      },
      error: (error) => {
        console.error('❌ Error al cargar resumen de productos:', error);
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters(): void {
    // Usar el FilterService para aplicar filtros
    this.filteredProducts = this.filterService.applyFilters(this.products, this.filterConfig);
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
    return status === 'A' ? 'Disponible' : 'No disponible';
  }

  getStockClass(product: ProductDTO): string {
    if (product.outOfStock) return 'out-of-stock';
    if (product.lowStock) return 'low-stock';
    return 'normal-stock';
  }

  getStockLabel(product: ProductDTO): string {
    if (product.outOfStock) return 'Sin stock';
    if (product.lowStock) return 'Stock bajo';
    return 'Stock normal';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  viewProduct(product: ProductDTO): void {
    this.selectedProduct = product;
    this.showDetailModal = true;
  }

  editProduct(product: ProductDTO): void {
    this.router.navigate(['/products/edit', product.idProduct]);
  }

  deleteProduct(product: ProductDTO): void {
    if (confirm(`¿Estás seguro de que deseas desactivar el producto "${product.productName}"?`)) {
      this.productsService.delete(product.idProduct).subscribe({
        next: () => {
          this.notificationService.productDeactivated(product.productName);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.notificationService.operationError('desactivar', 'producto', error.error?.message);
        }
      });
    }
  }

  restoreProduct(product: ProductDTO): void {
    if (confirm(`¿Estás seguro de que deseas reactivar el producto "${product.productName}"?`)) {
      this.productsService.restore(product.idProduct).subscribe({
        next: () => {
          this.notificationService.productRestored(product.productName);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error restoring product:', error);
          this.notificationService.operationError('reactivar', 'producto', error.error?.message);
        }
      });
    }
  }

  generateReport(): void {
    this.productsService.generatePdfReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-productos.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.idProduct;
  }

  clearFilters(): void {
    this.filterService.clearFilters();
    this.applyFilters();
  }

  refreshData(): void {
    this.loadProducts();
    this.loadSummary();
  }

  // Navigation methods
  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }

  // Detail modal methods
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedProduct = null;
  }

  getProductInitials(product: ProductDTO): string {
    return product.productName.charAt(0).toUpperCase();
  }

  editFromModal(): void {
    if (this.selectedProduct && this.selectedProduct.idProduct) {
      this.closeDetailModal();
      this.editProduct(this.selectedProduct);
    }
  }

  deleteFromModal(): void {
    if (this.selectedProduct) {
      this.deleteProduct(this.selectedProduct);
      this.closeDetailModal();
    }
  }

  restoreFromModal(): void {
    if (this.selectedProduct) {
      this.restoreProduct(this.selectedProduct);
      this.closeDetailModal();
    }
  }

  generateProductReport(product: ProductDTO): void {
    console.log('Generating individual report for product:', product);
    this.notificationService.info(`Generando reporte para "${product.productName}"`);
  }

}