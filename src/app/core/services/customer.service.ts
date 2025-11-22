import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/customer`;

  constructor(private http: HttpClient) {}

  // Métodos para portal de cliente
  getCustomerByEmail(email: string): Observable<any> {
    // Usar el endpoint de auth que no requiere autenticación especial
    return this.http.get(`${environment.urlBackEnd}/v1/api/auth/customer/profile?email=${email}`);
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getCustomerStats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/stats`);
  }

  // Métodos para admin
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/restore/${id}`, {});
  }

  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  existsByDocumentNumber(documentNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/document/${documentNumber}`);
  }

  existsByFullName(name: string, surname: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/name/${name}/${surname}`);
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/pdf`, { responseType: 'blob' });
  }

  // Métodos para pedidos del cliente
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${environment.urlBackEnd}/v1/api/customer/orders/create`, orderData);
  }

  getMyOrders(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlBackEnd}/v1/api/customer/orders/my-orders?customerId=${customerId}`);
  }

  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get(`${environment.urlBackEnd}/v1/api/customer/orders/order/${orderId}`);
  }

  findById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  findByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`);
  }

  // Métodos para ubicación en cascada
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlBackEnd}/v1/api/location/departments`);
  }

  getProvincesByDepartment(department: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlBackEnd}/v1/api/location/provinces/${department}`);
  }

  getDistrictsByProvince(department: string, province: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlBackEnd}/v1/api/location/districts/${department}/${province}`);
  }
}
