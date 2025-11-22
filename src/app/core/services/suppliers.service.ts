import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupplierDTO, SupplierRequest, SupplierSummary } from '../interfaces/suppliers-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/supplier`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<SupplierDTO> {
    return this.http.get<SupplierDTO>(`${this.apiUrl}/${id}`);
  }

  getByStatus(status: string): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getByCategory(category: string): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(`${this.apiUrl}/category/${category}`);
  }

  search(searchTerm: string, status: string = 'A'): Observable<SupplierDTO[]> {
    return this.http.get<SupplierDTO[]>(`${this.apiUrl}/search?search=${searchTerm}&status=${status}`);
  }

  getSummary(): Observable<SupplierSummary> {
    return this.http.get<SupplierSummary>(`${this.apiUrl}/summary`);
  }

  create(supplier: SupplierRequest): Observable<SupplierDTO> {
    return this.http.post<SupplierDTO>(`${this.apiUrl}/save`, supplier);
  }

  update(id: number, supplier: SupplierRequest): Observable<SupplierDTO> {
    return this.http.put<SupplierDTO>(`${this.apiUrl}/update/${id}`, supplier);
  }

  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}