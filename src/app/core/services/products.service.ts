import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductFormData } from '../interfaces/products-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url = `${environment.urlBackEnd}/v1/api/product`;



  constructor(private http: HttpClient) { }

  // Producto seleccionado
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSubject.asObservable();

  setSelectedProduct(product: Product | null): void {
    this.selectedProductSubject.next(product);
  }

  // CRUD productos
  findByStatus(status: 'A' | 'I'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/status/${status}`);
  }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.urlBackEnd}/v1/api/products-simple`);
  }

  // Obtener producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  // Crear nuevo producto
  create(product: ProductFormData): Observable<Product> {
    return this.http.post<Product>(`${this.url}/save`, product);
  }

  // Actualizar producto
  update(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/update/${product.id_Product}`, product);
  }

  // Eliminar producto (cambiar status a inactivo)
  delete(idProduct: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/delete/${idProduct}`, {});
  }

  // Restaurar producto (cambiar status a activo)
  restore(idProduct: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/restore/${idProduct}`, {});
  }

  // Generar reporte PDF de productos
  reportPdf(): Observable<Blob> {
    return this.http.get(`${this.url}/pdf`, { responseType: 'blob' });
  }

  // Generar reporte PDF filtrado por categoría
  reportPdfByCategory(category: string): Observable<Blob> {
    return this.http.get(`${this.url}/pdf/category/${category}`, { responseType: 'blob' });
  }

  // Obtener categorías disponibles
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categories`);
  }

  // Filtros por categoría
  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/category/${category}`);
  }

  // Filtros por stock bajo
  getLowStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/low-stock`);
  }

  // Filtros por sin stock
  getOutOfStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/out-of-stock`);
  }

  // Métodos de conveniencia para mantener compatibilidad
  createProduct(product: ProductFormData): Observable<Product> {
    return this.create(product);
  }

  updateProduct(id: number, productData: ProductFormData): Observable<Product> {
    const product: Product = {
      id_Product: id,
      ...productData,
      Status: productData.Status || 'A'
    };
    return this.update(product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.delete(id);
  }
}
