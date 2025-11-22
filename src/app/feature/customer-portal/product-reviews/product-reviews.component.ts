import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductReviewsService, ProductReview, ProductReviewStats } from '../../../core/services/product-reviews.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId!: number;
  @Input() customerId: number = 1; // Obtener del servicio de autenticación
  @Input() canAddReview: boolean = true;

  reviews: ProductReview[] = [];
  stats: ProductReviewStats | null = null;
  reviewForm: FormGroup;
  selectedRating = 0;

  constructor(
    private fb: FormBuilder,
    private reviewsService: ProductReviewsService,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.productId) {
      this.loadReviews();
      this.loadStats();
    }
  }

  loadReviews(): void {
    this.reviewsService.getReviewsByProduct(this.productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  loadStats(): void {
    this.reviewsService.getProductReviewStats(this.productId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitReview(): void {
    if (this.reviewForm.invalid || this.selectedRating === 0) {
      return;
    }

    const review: ProductReview = {
      idProduct: this.productId,
      idCustomer: this.customerId,
      rating: this.selectedRating,
      comment: this.reviewForm.value.comment
    };

    this.reviewsService.createReview(review).subscribe({
      next: () => {
        this.snackBar.open('¡Reseña publicada exitosamente!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.reviewForm.reset();
        this.selectedRating = 0;
        this.loadReviews();
        this.loadStats();
      },
      error: (error) => {
        this.snackBar.open('Error al publicar la reseña', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
