import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Product, CustomerStats } from '../../../core/interfaces/customer-portal-interfaces';
import { CustomerProductsService } from '../../../core/services/customer-products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './customer-home.html',
  styleUrls: ['./customer-home.scss']
})
export class CustomerHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  featuredProducts: Product[] = [];
  popularProducts: Product[] = [];
  categories: string[] = [];
  customerStats: CustomerStats | null = null;
  isLoading = true;

  constructor(
    private customerProductsService: CustomerProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHomeData(): void {
    this.isLoading = true;
    
    // Cargar datos reales desde la API
    forkJoin({
      featuredProducts: this.customerProductsService.getFeaturedProducts(3),
      popularProducts: this.customerProductsService.getAvailableProducts(),
      categories: this.customerProductsService.getAvailableCategories()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.featuredProducts = data.featuredProducts;
        this.popularProducts = data.popularProducts.slice(0, 2); // Solo los primeros 2
        this.categories = data.categories.slice(0, 5); // Solo las primeras 5 categorías
        
        // Stats reales - mostrar 0 si no hay datos
        this.customerStats = {
          totalOrders: 0,
          totalSpent: 0,
          favoriteCategory: data.categories[0] || 'Sin categoría',
          lastOrderDate: undefined
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading home data:', error);
        // Fallback a datos simulados en caso de error
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }

  private loadFallbackData(): void {
    this.featuredProducts = this.getMockFeaturedProducts();
    this.popularProducts = this.getMockPopularProducts();
    this.categories = ['Pizza', 'Hamburguesas', 'Pollo', 'Bebidas', 'Postres'];
    // Stats reales - mostrar 0 si no hay datos
    this.customerStats = {
      totalOrders: 0,
      totalSpent: 0,
      favoriteCategory: 'Sin categoría',
      lastOrderDate: undefined
    };
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
  }

  private getMockFeaturedProducts(): Product[] {
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
      }
    ];
  }

  private getMockPopularProducts(): Product[] {
    return [
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
      }
    ];
  }
}