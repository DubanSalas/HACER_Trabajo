import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  SaleWithDetails,
  CreateSaleRequest,
  UpdateSaleRequest,
  SaleStats,
  SaleFilters,
  SaleProduct
} from '../interfaces/sales-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly url = `${environment.urlBackEnd}/v1/api/sale`;

  private salesSubject = new BehaviorSubject<SaleWithDetails[]>([]);
  private statsSubject = new BehaviorSubject<SaleStats>({
    ventas_totales: 0,
    ventas_hoy: 0,
    completadas: 0,
    pendientes: 0,
    total_ventas: 0,
    total_hoy: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public sales$ = this.salesSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Obtener todas las ventas
  getSales(filters?: SaleFilters): Observable<SaleWithDetails[]> {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof SaleFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<SaleWithDetails[]>(`${environment.urlBackEnd}/v1/api/sales-simple`, { params }).pipe(
      tap(sales => {
        this.salesSubject.next(sales);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching sales:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener venta por ID
  getSaleById(id: number): Observable<SaleWithDetails> {
    return this.http.get<SaleWithDetails>(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching sale:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nueva venta
  createSale(sale: CreateSaleRequest): Observable<SaleWithDetails> {
    this.loadingSubject.next(true);

    return this.http.post<SaleWithDetails>(this.url, sale).pipe(
      tap(newSale => {
        const currentSales = this.salesSubject.value;
        this.salesSubject.next([newSale, ...currentSales]);
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating sale:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar venta
  updateSale(id: number, sale: UpdateSaleRequest): Observable<SaleWithDetails> {
    this.loadingSubject.next(true);

    return this.http.put<SaleWithDetails>(`${this.url}/${id}`, sale).pipe(
      tap(updatedSale => {
        const currentSales = this.salesSubject.value;
        const index = currentSales.findIndex(s => s.id_venta === id);
        if (index !== -1) {
          currentSales[index] = updatedSale;
          this.salesSubject.next([...currentSales]);
        }
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error updating sale:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar venta
  deleteSale(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        const currentSales = this.salesSubject.value;
        const filteredSales = currentSales.filter(sale => sale.id_venta !== id);
        this.salesSubject.next(filteredSales);
        this.updateStats();
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error deleting sale:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener estadísticas
  getStats(): Observable<SaleStats> {
    return this.http.get<SaleStats>(`${this.url}/summary`).pipe(
      tap(stats => this.statsSubject.next(stats))
    );
  }

  // Obtener productos para ventas
  getProductsForSale(): Observable<SaleProduct[]> {
    return this.http.get<SaleProduct[]>(`${environment.urlBackEnd}/v1/api/product/status/A`);
  }

  // Actualizar estadísticas localmente
  private updateStats(): void {
    const sales = this.salesSubject.value;
    const today = new Date().toISOString().split('T')[0];

    const stats: SaleStats = {
      ventas_totales: sales.length,
      ventas_hoy: sales.filter(sale => sale.fecha_venta.startsWith(today)).length,
      completadas: sales.filter(sale => sale.estado === 'Completado').length,
      pendientes: sales.filter(sale => sale.estado === 'Pendiente').length,
      total_ventas: sales.reduce((sum, sale) => sum + sale.total, 0),
      total_hoy: sales
        .filter(sale => sale.fecha_venta.startsWith(today))
        .reduce((sum, sale) => sum + sale.total, 0)
    };

    this.statsSubject.next(stats);
  }

  // Limpiar datos
  clearData(): void {
    this.salesSubject.next([]);
    this.statsSubject.next({
      ventas_totales: 0,
      ventas_hoy: 0,
      completadas: 0,
      pendientes: 0,
      total_ventas: 0,
      total_hoy: 0
    });
  }
}