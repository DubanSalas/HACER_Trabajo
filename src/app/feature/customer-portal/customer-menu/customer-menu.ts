import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, forkJoin, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product } from '../../../core/interfaces/customer-portal-interfaces';
import { CustomerProductsService } from '../../../core/services/customer-products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-customer-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './customer-menu.html',
  styleUrls: ['./customer-menu.scss']
})
export class CustomerMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  searchTerm = '';
  isLoading = true;

  constructor(
    private customerProductsService: CustomerProductsService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadProducts();

    // Check for category filter from query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
          this.filterProducts();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(): void {
    this.isLoading = true;

    // Cargar productos reales desde la API
    forkJoin({
      products: this.customerProductsService.getAvailableProducts(),
      categories: this.customerProductsService.getAvailableCategories()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.products = data.products;
        this.categories = data.categories;
        this.filteredProducts = [...this.products];
        this.filterProducts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback a datos simulados en caso de error
        this.loadFallbackProducts();
        this.isLoading = false;
      }
    });
  }

  private loadFallbackProducts(): void {
    this.products = this.getMockProducts();
    this.categories = [...new Set(this.products.map(p => p.category))];
    this.filteredProducts = [...this.products];
    this.filterProducts();
  }

  filterProducts(): void {
    if (this.searchTerm.trim() && !this.selectedCategory) {
      // Si hay búsqueda, usar el servicio de búsqueda
      this.customerProductsService.searchProducts(this.searchTerm.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (products) => {
            this.filteredProducts = products;
          },
          error: (error) => {
            console.error('Error searching products:', error);
            this.filterProductsLocally();
          }
        });
    } else if (this.selectedCategory && !this.searchTerm.trim()) {
      // Si hay categoría seleccionada, usar el servicio de categoría
      this.customerProductsService.getProductsByCategory(this.selectedCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (products) => {
            this.filteredProducts = products;
          },
          error: (error) => {
            console.error('Error filtering by category:', error);
            this.filterProductsLocally();
          }
        });
    } else {
      // Filtrar localmente
      this.filterProductsLocally();
    }
  }

  private filterProductsLocally(): void {
    let filtered = [...this.products];

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
    this.snackBar.open(`${product.name} agregado al carrito`, 'Ver Carrito', {
      duration: 3000
    }).onAction().subscribe(() => {
      // Navigate to cart - will be handled by router
    });
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Pizza Margherita Especial',
        description: 'Pizza artesanal con mozzarella fresca, tomate y albahaca',
        price: 24.90,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Pizza',
        isAvailable: true,
        rating: 4.8,
        reviews: 156
      },
      {
        id: '2',
        name: 'Hamburguesa Gourmet',
        description: 'Carne angus, queso cheddar, bacon y vegetales frescos',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Hamburguesas',
        isAvailable: true,
        rating: 4.6,
        reviews: 89
      },
      {
        id: '3',
        name: 'Pollo a la Parrilla',
        description: 'Pechuga de pollo marinada con hierbas y especias',
        price: 16.90,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
        category: 'Pollo',
        isAvailable: true,
        rating: 4.7,
        reviews: 124
      },
      {
        id: '4',
        name: 'Pizza Pepperoni',
        description: 'Clásica pizza con pepperoni y queso mozzarella',
        price: 22.90,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: 'Pizza',
        isAvailable: true,
        rating: 4.5,
        reviews: 203
      },
      {
        id: '5',
        name: 'Alitas BBQ',
        description: 'Alitas de pollo bañadas en salsa BBQ casera',
        price: 14.90,
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
        category: 'Pollo',
        isAvailable: true,
        rating: 4.4,
        reviews: 167
      },
      {
        id: '6',
        name: 'Coca Cola 500ml',
        description: 'Bebida gaseosa refrescante',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        category: 'Bebidas',
        isAvailable: true,
        rating: 4.2,
        reviews: 45
      },
      {
        id: '7',
        name: 'Cheesecake de Fresa',
        description: 'Delicioso cheesecake con salsa de fresas frescas',
        price: 12.90,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
        category: 'Postres',
        isAvailable: true,
        rating: 4.9,
        reviews: 78
      },
      {
        id: '8',
        name: 'Pizza Hawaiana',
        description: 'Pizza con jamón, piña y queso mozzarella',
        price: 23.90,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza',
        isAvailable: true,
        rating: 4.3,
        reviews: 134
      }
    ];
  }
}