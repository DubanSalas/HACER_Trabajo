import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerProductsService } from '../../../core/services/customer-products.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/interfaces/customer-portal-interfaces';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductReviewsComponent
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: CustomerProductsService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.router.navigate(['/customer/menu']);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading = true;
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error al cargar el producto', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/customer/menu']);
      }
    });
  }

  increaseQuantity(): void {
    if (this.product) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addProduct(this.product, this.quantity);
      this.snackBar.open(`${this.product.name} agregado al carrito`, 'Ver Carrito', {
        duration: 3000
      }).onAction().subscribe(() => {
        this.router.navigate(['/customer/cart']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customer/menu']);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= rating;
  }
}
