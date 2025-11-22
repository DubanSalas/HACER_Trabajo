import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  DashboardSummary,
  SaleRecentSummary,
  CompleteDashboardData,
  TopProduct,
  LowStockItem,
  RecentCustomer,
  EmployeeSummary,
  SupplierSummary
} from '../interfaces/dashboard-interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`).pipe(
      catchError(error => {
        console.error('Error fetching dashboard summary:', error);
        // Retornar datos por defecto en caso de error
        return of({
          ventasDelDia: 0,
          porcentajeVentasAyer: '0% vs ayer',
          totalClientes: 0,
          porcentajeClientesAyer: '0% vs ayer',
          totalEmpleados: 0,
          porcentajeEmpleadosAyer: '0% vs ayer',
          totalProductos: 0,
          productosDisponibles: 0
        });
      })
    );
  }

  getRecentSales(limit: number = 10): Observable<SaleRecentSummary[]> {
    return this.http.get<SaleRecentSummary[]>(`${this.apiUrl}/recent-sales?limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching recent sales:', error);
        // Retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  getTopProducts(limit: number = 5): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products?limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching top products:', error);
        return of([]);
      })
    );
  }

  getLowStockItems(): Observable<LowStockItem[]> {
    return this.http.get<LowStockItem[]>(`${this.apiUrl}/low-stock`).pipe(
      catchError(error => {
        console.error('Error fetching low stock items:', error);
        return of([]);
      })
    );
  }

  getRecentCustomers(limit: number = 5): Observable<RecentCustomer[]> {
    return this.http.get<RecentCustomer[]>(`${this.apiUrl}/recent-customers?limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching recent customers:', error);
        return of([]);
      })
    );
  }

  getEmployeeSummary(): Observable<EmployeeSummary[]> {
    return this.http.get<EmployeeSummary[]>(`${this.apiUrl}/employees-summary`).pipe(
      catchError(error => {
        console.error('Error fetching employees summary:', error);
        return of([]);
      })
    );
  }

  getSupplierSummary(): Observable<SupplierSummary[]> {
    return this.http.get<SupplierSummary[]>(`${this.apiUrl}/suppliers-summary`).pipe(
      catchError(error => {
        console.error('Error fetching suppliers summary:', error);
        return of([]);
      })
    );
  }

  getCompleteDashboard(): Observable<CompleteDashboardData> {
    return this.http.get<CompleteDashboardData>(`${this.apiUrl}/complete`).pipe(
      catchError(error => {
        console.error('Error fetching complete dashboard:', error);
        return of({
          summary: {
            ventasDelDia: 0,
            porcentajeVentasAyer: '0% vs ayer',
            totalClientes: 0,
            porcentajeClientesAyer: '0% vs ayer',
            totalEmpleados: 0,
            porcentajeEmpleadosAyer: '0% vs ayer',
            totalProductos: 0,
            productosDisponibles: 0
          },
          recentSales: [],
          topProducts: [],
          lowStockItems: [],
          recentCustomers: [],
          employeeSummary: [],
          supplierSummary: []
        });
      })
    );
  }
}