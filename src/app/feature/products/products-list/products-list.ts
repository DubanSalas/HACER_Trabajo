import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { ProductsService } from "../../../core/services/products.service";
import { Product, ProductStats, ProductTopStock } from "../../../core/interfaces/products-interfaces";
import { ProductForm } from "../products-form/products-form";
import Swal from 'sweetalert2';

@Component({
  selector: "app-products-list",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: "./products-list.html",
  styleUrls: ["./products-list.scss"],
})
export class ProductsList implements OnInit {
  private dialog = inject(MatDialog);
  private productsService = inject(ProductsService);

  displayedColumns: string[] = [
    "producto",
    "categoria", 
    "precio",
    "stock",
    "estado",
    "valorTotal",
    "acciones",
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  stats: ProductStats = {
    total: 0,
    disponibles: 0,
    stockBajo: 0,
    sinStock: 0,
    valorTotal: 0,
    precioPromedio: 0,
  };
  topProducts: ProductTopStock[] = [];

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  sortBy: string = 'nombre';

  // Vista
  viewMode: "list" | "grid" = "list";

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.calculateStats();
        this.calculateTopProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Datos de ejemplo para desarrollo
        this.loadMockData();
      }
    });
  }

  private loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadMockData(): void {
    // Datos de ejemplo basados en tu imagen
    this.products = [
      {
        id_Product: 1,
        Product_Code: 'P001',
        Product_Name: 'Croissant de Mantequilla',
        Category: 'Panadería',
        Description: 'Delicioso croissant de mantequilla recién horneado',
        Price: 3.50,
        Stock: 48,
        Initial_Stock: 100,
        Image_Url: '/images/croissant.jpg',
        Status: 'A'
      },
      {
        id_Product: 2,
        Product_Code: 'P002',
        Product_Name: 'Pan Francés',
        Category: 'Panadería',
        Description: 'Pan francés tradicional con corteza crujiente',
        Price: 2.00,
        Stock: 200,
        Initial_Stock: 200,
        Image_Url: '/images/pan-frances.jpg',
        Status: 'A'
      },
      {
        id_Product: 3,
        Product_Code: 'P003',
        Product_Name: 'Tarta de Chocolate',
        Category: 'Repostería',
        Description: 'Exquisita tarta de chocolate con cobertura',
        Price: 25.00,
        Stock: 12,
        Initial_Stock: 20,
        Image_Url: '/images/tarta-chocolate.jpg',
        Status: 'A'
      },
      {
        id_Product: 4,
        Product_Code: 'P004',
        Product_Name: 'Tarta de Vainilla',
        Category: 'Repostería',
        Description: 'Suave tarta de vainilla con crema',
        Price: 22.00,
        Stock: 8,
        Initial_Stock: 15,
        Image_Url: '/images/tarta-vainilla.jpg',
        Status: 'A'
      }
    ];
    this.filteredProducts = this.products;
    this.categories = ['Panadería', 'Repostería'];
    this.calculateStats();
    this.calculateTopProducts();
  }

  private calculateStats(): void {
    this.stats.total = this.products.length;
    this.stats.disponibles = this.products.filter(p => p.Stock > 10).length;
    this.stats.stockBajo = this.products.filter(p => p.Stock > 0 && p.Stock <= 10).length;
    this.stats.sinStock = this.products.filter(p => p.Stock === 0).length;
    
    this.stats.valorTotal = this.products.reduce((sum, p) => sum + (p.Price * p.Stock), 0);
    this.stats.precioPromedio = this.products.length > 0 ? 
      this.products.reduce((sum, p) => sum + p.Price, 0) / this.products.length : 0;
  }

  private calculateTopProducts(): void {
    this.topProducts = this.products
      .sort((a, b) => b.Stock - a.Stock)
      .slice(0, 4)
      .map((p, index) => ({
        id: index + 1,
        name: p.Product_Name,
        stock: p.Stock
      }));
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.Product_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.Product_Code.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || product.Category === this.selectedCategory;
      
      let matchesStatus = true;
      if (this.selectedStatus === 'disponible') {
        matchesStatus = product.Stock > 10;
      } else if (this.selectedStatus === 'stock-bajo') {
        matchesStatus = product.Stock > 0 && product.Stock <= 10;
      } else if (this.selectedStatus === 'sin-stock') {
        matchesStatus = product.Stock === 0;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Aplicar ordenamiento
    this.applySorting();
  }

  private applySorting(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'nombre':
          return a.Product_Name.localeCompare(b.Product_Name);
        case 'precio':
          return a.Price - b.Price;
        case 'stock':
          return b.Stock - a.Stock;
        default:
          return 0;
      }
    });
  }

  getStatusText(product: Product): string {
    if (product.Stock === 0) return 'Sin Stock';
    if (product.Stock <= 10) return 'Stock Bajo';
    return 'Disponible';
  }

  getStatusClass(product: Product): string {
    if (product.Stock === 0) return 'status-sin-stock';
    if (product.Stock <= 10) return 'status-stock-bajo';
    return 'status-disponible';
  }

  getValueTotal(product: Product): number {
    return product.Price * product.Stock;
  }

  openProductForm(): void {
    const dialogRef = this.dialog.open(ProductForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { product, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto ${product.Product_Name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && product.id_Product) {
        this.productsService.deleteProduct(product.id_Product).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          }
        });
      }
    });
  }

  viewProduct(product: Product): void {
    console.log("View product:", product);
  }

  toggleViewMode(mode: "list" | "grid"): void {
    this.viewMode = mode;
  }

  exportReport(): void {
    this.productsService.reportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-productos-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        Swal.fire('Éxito', 'Reporte descargado correctamente', 'success');
      },
      error: (error) => {
        console.error('Error generating report:', error);
        Swal.fire('Información', 'Función de exportación en desarrollo', 'info');
      }
    });
  }
}
