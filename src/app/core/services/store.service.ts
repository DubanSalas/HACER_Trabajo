import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StoreItemDTO, StoreItemRequest, StoreItemSummary } from '../interfaces/store-interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/store-item`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<StoreItemDTO> {
    return this.http.get<StoreItemDTO>(`${this.apiUrl}/${id}`);
  }

  getByItemCode(itemCode: string): Observable<StoreItemDTO> {
    return this.http.get<StoreItemDTO>(`${this.apiUrl}/code/${itemCode}`);
  }

  getByStatus(status: string): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getByCategory(category: string): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(`${this.apiUrl}/category/${category}`);
  }

  getLowStockItems(): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(`${this.apiUrl}/low-stock`);
  }

  getNearExpiryItems(): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(`${this.apiUrl}/near-expiry`);
  }

  search(searchTerm: string, status: string = 'A'): Observable<StoreItemDTO[]> {
    return this.http.get<StoreItemDTO[]>(`${this.apiUrl}/search?search=${searchTerm}&status=${status}`);
  }

  getSummary(): Observable<StoreItemSummary> {
    return this.http.get<StoreItemSummary>(`${this.apiUrl}/summary`);
  }

  create(item: StoreItemRequest): Observable<StoreItemDTO> {
    return this.http.post<StoreItemDTO>(`${this.apiUrl}/save`, item);
  }

  update(id: number, item: StoreItemRequest): Observable<StoreItemDTO> {
    return this.http.put<StoreItemDTO>(`${this.apiUrl}/update/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
  }

  updateStock(id: number, newStock: number): Observable<StoreItemDTO> {
    return this.http.put<StoreItemDTO>(`${this.apiUrl}/${id}/stock?newStock=${newStock}`, {});
  }

  addStock(id: number, quantity: number): Observable<StoreItemDTO> {
    return this.http.put<StoreItemDTO>(`${this.apiUrl}/${id}/add-stock?quantity=${quantity}`, {});
  }

  reduceStock(id: number, quantity: number): Observable<StoreItemDTO> {
    return this.http.put<StoreItemDTO>(`${this.apiUrl}/${id}/reduce-stock?quantity=${quantity}`, {});
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}