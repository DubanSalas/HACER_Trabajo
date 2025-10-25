import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supplier, Location, SupplierFormData } from '../interfaces/suppliers-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private readonly url = `${environment.urlBackEnd}/v1/api/supplier`;
  private readonly locationUrl = `${environment.urlBackEnd}/v1/api/location`;

  constructor(private http: HttpClient) { }

  // Proveedor seleccionado
  private selectedSupplierSubject = new BehaviorSubject<Supplier | null>(null);
  selectedSupplier$ = this.selectedSupplierSubject.asObservable();

  setSelectedSupplier(supplier: Supplier | null): void {
    this.selectedSupplierSubject.next(supplier);
  }

  // CRUD proveedores
  findByStatus(status: 'A' | 'I' | 'S'): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/status/${status}`);
  }

  // Obtener todos los proveedores
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/all`);
  }

  // Obtener proveedor por ID
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.url}/${id}`);
  }

  // Crear nuevo proveedor
  create(supplier: SupplierFormData): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.url}/save`, supplier);
  }

  // Actualizar proveedor
  update(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.url}/update/${supplier.id_Supplier}`, supplier);
  }

  // Eliminar proveedor (cambiar status a inactivo)
  delete(idSupplier: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${idSupplier}`);
  }

  // Restaurar proveedor (cambiar status a activo)
  restore(idSupplier: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${idSupplier}`, {});
  }

  // Generar reporte PDF de proveedores
  reportPdf(): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf`, { responseType: 'blob' as 'json' });
  }

  // Generar reporte PDF filtrado por categoría
  reportPdfByCategory(category: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf/category/${category}`, { responseType: 'blob' as 'json' });
  }

  // Obtener ubicaciones (datos temporales hasta implementar en backend)
  getLocations(): Observable<Location[]> {
    const locations: Location[] = [
      { identifier_Location: 1, department: 'Lima', province: 'Lima', district: 'Lima', address: 'Av. Principal 123' },
      { identifier_Location: 2, department: 'Lima', province: 'Lima', district: 'Miraflores', address: 'Av. Larco 456' },
      { identifier_Location: 3, department: 'Lima', province: 'Lima', district: 'San Isidro', address: 'Av. Javier Prado 789' },
      { identifier_Location: 4, department: 'Lima', province: 'Lima', district: 'Surco', address: 'Av. Benavides 321' },
      { identifier_Location: 5, department: 'Arequipa', province: 'Arequipa', district: 'Cercado', address: 'Calle Mercaderes 111' }
    ];
    return new Observable(observer => {
      observer.next(locations);
      observer.complete();
    });
  }

  // Obtener categorías disponibles
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categories`);
  }

  // Filtros por categoría
  getByCategory(category: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/category/${category}`);
  }

  // Filtros por términos de pago
  getByPaymentTerms(paymentTerms: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/payment-terms/${paymentTerms}`);
  }

  // Filtros por ubicación
  getByLocation(locationId: number): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/location/${locationId}`);
  }

  // Métodos de conveniencia para mantener compatibilidad
  createSupplier(supplier: SupplierFormData): Observable<Supplier> {
    return this.create(supplier);
  }

  updateSupplier(id: number, supplierData: SupplierFormData): Observable<Supplier> {
    const supplier: Supplier = {
      id_Supplier: id,
      ...supplierData,
      Status: supplierData.Status || 'A'
    };
    return this.update(supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.delete(id);
  }
}
