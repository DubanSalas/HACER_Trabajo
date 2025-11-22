import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductDTO, ProductRequest, ProductSummary, TopProduct } from '../interfaces/products-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/product`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`);
  }

  getByProductCode(productCode: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/code/${productCode}`);
  }

  getByStatus(status: string): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getByCategory(category: string): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}/category/${category}`);
  }

  search(searchTerm: string, status: string = 'A'): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}/search?search=${searchTerm}&status=${status}`);
  }

  getSummary(): Observable<ProductSummary> {
    return this.http.get<ProductSummary>(`${this.apiUrl}/summary`);
  }

  getTopProductsByStock(limit: number = 4): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-stock?limit=${limit}`);
  }

  create(product: ProductRequest): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.apiUrl}/save`, product);
  }

  update(id: number, product: ProductRequest): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/update/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
  }

  updateStock(id: number, newStock: number): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}/stock?newStock=${newStock}`, {});
  }

  addStock(id: number, quantity: number): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}/add-stock?quantity=${quantity}`, {});
  }

  reduceStock(id: number, quantity: number): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}/reduce-stock?quantity=${quantity}`, {});
  }

  generateNextProductCode(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/generate-code`);
  }

  existsByProductCode(productCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/code/${productCode}`);
  }

  existsByProductName(productName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/name/${productName}`);
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}