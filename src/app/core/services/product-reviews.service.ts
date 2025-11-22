import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductReview {
  idReview?: number;
  idProduct: number;
  productName?: string;
  idCustomer: number;
  customerName?: string;
  rating: number;
  comment: string;
  reviewDate?: string;
  status?: string;
}

export interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductReviewsService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/reviews`;

  constructor(private http: HttpClient) {}

  createReview(review: ProductReview): Observable<ProductReview> {
    return this.http.post<ProductReview>(this.apiUrl, review);
  }

  getReviewsByProduct(idProduct: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.apiUrl}/product/${idProduct}`);
  }

  getReviewsByCustomer(idCustomer: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.apiUrl}/customer/${idCustomer}`);
  }

  getProductReviewStats(idProduct: number): Observable<ProductReviewStats> {
    return this.http.get<ProductReviewStats>(`${this.apiUrl}/product/${idProduct}/stats`);
  }

  updateReview(idReview: number, review: ProductReview): Observable<ProductReview> {
    return this.http.put<ProductReview>(`${this.apiUrl}/${idReview}`, review);
  }

  deleteReview(idReview: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idReview}`);
  }
}
