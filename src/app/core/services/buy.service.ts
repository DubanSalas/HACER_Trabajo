import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseResponse } from '../interfaces/buy-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BuyService {
  private readonly url = `${environment.urlBackEnd}/v1/api/buy`;

  constructor(private http: HttpClient) { }

  // Obtener todas las compras
  getPurchases(page = 1, pageSize = 10, search?: string): Observable<PurchaseResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PurchaseResponse>(this.url, { params });
  }

  // Obtener compra por ID
  getPurchaseById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.url}/${id}`);
  }

  // Crear compra
  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.url}/save`, purchase);
  }

  // Actualizar compra
  updatePurchase(id: number, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.url}/update/${id}`, purchase);
  }

  // Eliminar compra
  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  // Obtener todas las compras sin paginación
  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.url}/all`);
  }

  // Obtener compras por estado
  getPurchasesByStatus(status: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.url}/status/${status}`);
  }

  // Obtener compras por proveedor
  getPurchasesBySupplier(supplierId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.url}/supplier/${supplierId}`);
  }

  // Generar reporte PDF
  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.url}/pdf`, { responseType: 'blob' });
  }
}
