import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  StoreItem,
  CreateStoreItemRequest,
  UpdateStoreItemRequest,
  StoreStats,
  StoreFilters,
  StockMovement,
  CreateStockMovementRequest,
  StoreProduct,
  StoreSupplier
} from '../interfaces/store-interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly url = `${environment.urlBackEnd}/v1/api/store-item`;

  private storeItemsSubject = new BehaviorSubject<StoreItem[]>([]);
  private statsSubject = new BehaviorSubject<StoreStats>({
    total_products: 0,
    low_stock: 0,
    out_of_stock: 0,
    expiring_soon: 0,
    total_value: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public storeItems$ = this.storeItemsSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Obtener todos los items del almacén
  getStoreItems(filters?: StoreFilters): Observable<StoreItem[]> {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof StoreFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<StoreItem[]>(this.url, { params }).pipe(
      tap(items => {
        this.storeItemsSubject.next(items);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching store items:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener item por ID
  getStoreItemById(id: number): Observable<StoreItem> {
    return this.http.get<StoreItem>(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching store item:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nuevo item en almacén
  createStoreItem(item: CreateStoreItemRequest): Observable<StoreItem> {
    this.loadingSubject.next(true);

    return this.http.post<StoreItem>(this.url, item).pipe(
      tap(newItem => {
        const currentItems = this.storeItemsSubject.value;
        this.storeItemsSubject.next([newItem, ...currentItems]);
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating store item:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar item del almacén
  updateStoreItem(id: number, item: UpdateStoreItemRequest): Observable<StoreItem> {
    this.loadingSubject.next(true);

    return this.http.put<StoreItem>(`${this.url}/${id}`, item).pipe(
      tap(updatedItem => {
        const currentItems = this.storeItemsSubject.value;
        const index = currentItems.findIndex(i => i.id_store === id);
        if (index !== -1) {
          currentItems[index] = updatedItem;
          this.storeItemsSubject.next([...currentItems]);
        }
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error updating store item:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar item del almacén
  deleteStoreItem(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        const currentItems = this.storeItemsSubject.value;
        const filteredItems = currentItems.filter(item => item.id_store !== id);
        this.storeItemsSubject.next(filteredItems);
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error deleting store item:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener estadísticas del almacén
  getStats(): Observable<StoreStats> {
    return this.http.get<StoreStats>(`${this.url}/stats`).pipe(
      tap(stats => this.statsSubject.next(stats)),
      catchError(error => {
        console.error('Error fetching stats:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener movimientos de stock
  getStockMovements(storeId?: number): Observable<StockMovement[]> {
    let params = new HttpParams();
    if (storeId) {
      params = params.set('store_id', storeId.toString());
    }

    return this.http.get<StockMovement[]>(`${this.url}/movements`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching stock movements:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear movimiento de stock
  createStockMovement(movement: CreateStockMovementRequest): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.url}/movements`, movement).pipe(
      tap(() => {
        // Recargar items para actualizar stock
        this.getStoreItems().subscribe();
      }),
      catchError(error => {
        console.error('Error creating stock movement:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener productos disponibles para almacén
  getProductsForStore(): Observable<StoreProduct[]> {
    return this.http.get<StoreProduct[]>(`${environment.urlBackEnd}/v1/api/product/status/A`).pipe(
      catchError(error => {
        console.error('Error fetching products for store:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener proveedores para almacén
  getSuppliersForStore(): Observable<StoreSupplier[]> {
    return this.http.get<StoreSupplier[]>(`${environment.urlBackEnd}/v1/api/supplier/status/A`).pipe(
      catchError(error => {
        console.error('Error fetching suppliers for store:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar estadísticas localmente
  private updateStats(): void {
    const items = this.storeItemsSubject.value;
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats: StoreStats = {
      total_products: items.length,
      low_stock: items.filter(item => item.current_stock <= item.min_stock && item.current_stock > 0).length,
      out_of_stock: items.filter(item => item.current_stock === 0).length,
      expiring_soon: items.filter(item => {
        const expiryDate = new Date(item.expiry_date);
        return expiryDate <= sevenDaysFromNow && expiryDate >= today;
      }).length,
      total_value: items.reduce((sum, item) => sum + (item.current_stock * item.unit_price), 0)
    };

    this.statsSubject.next(stats);
  }

  // Obtener categorías únicas
  getCategories(): string[] {
    const items = this.storeItemsSubject.value;
    const categories = [...new Set(items.map(item => item.category))];
    return categories.sort();
  }

  // Obtener estados únicos
  getStatuses(): string[] {
    return ['Disponible', 'Agotado', 'Próximo a Vencer', 'Vencido', 'En Revisión'];
  }

  // Obtener unidades de medida
  getUnits(): string[] {
    return ['kg', 'g', 'L', 'ml', 'unidad', 'caja', 'paquete', 'bolsa'];
  }

  // Limpiar datos
  clearData(): void {
    this.storeItemsSubject.next([]);
    this.statsSubject.next({
      total_products: 0,
      low_stock: 0,
      out_of_stock: 0,
      expiring_soon: 0,
      total_value: 0
    });
  }
}