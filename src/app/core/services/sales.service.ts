import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SaleDTO, SaleRequest, SaleSummary } from '../interfaces/sales-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/sale`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<SaleDTO> {
    return this.http.get<SaleDTO>(`${this.apiUrl}/${id}`);
  }

  getBySaleCode(saleCode: string): Observable<SaleDTO> {
    return this.http.get<SaleDTO>(`${this.apiUrl}/code/${saleCode}`);
  }

  getByStatus(status: string): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getByCustomer(customerId: number): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getByEmployee(employeeId: number): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  getByPaymentMethod(paymentMethod: string): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(`${this.apiUrl}/payment-method/${paymentMethod}`);
  }

  search(searchTerm: string, status: string = 'Completado'): Observable<SaleDTO[]> {
    return this.http.get<SaleDTO[]>(`${this.apiUrl}/search?search=${searchTerm}&status=${status}`);
  }

  getSummary(): Observable<SaleSummary> {
    return this.http.get<SaleSummary>(`${this.apiUrl}/summary`);
  }

  create(sale: SaleRequest): Observable<SaleDTO> {
    return this.http.post<SaleDTO>(`${this.apiUrl}/save`, sale);
  }

  update(id: number, sale: SaleRequest): Observable<SaleDTO> {
    return this.http.put<SaleDTO>(`${this.apiUrl}/update/${id}`, sale);
  }

  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
  }

  generateNextSaleCode(): Observable<string> {
    return this.http.get(`${this.apiUrl}/generate-code`, { responseType: 'text' });
  }

  existsBySaleCode(saleCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/code/${saleCode}`);
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }

  generatePdfBySaleId(saleId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${saleId}`, { responseType: 'blob' });
  }

  testConnection(): Observable<string> {
    return this.http.post(`${this.apiUrl}/test`, 'Frontend test data', { responseType: 'text' });
  }

  validateSaleData(saleData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/validate`, saleData, { responseType: 'text' });
  }

  checkAvailableData(): Observable<string> {
    return this.http.get(`${this.apiUrl}/check-data`, { responseType: 'text' });
  }

  testSimpleSave(saleData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/save-simple`, saleData, { responseType: 'text' });
  }

  createTestData(): Observable<string> {
    return this.http.post(`${this.apiUrl}/create-test-data`, {}, { responseType: 'text' });
  }
}