import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  salesThisMonth: number;
  newCustomersThisMonth: number;
  lowStockProducts: number;
  pendingSales: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly url = `${environment.urlBackEnd}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.url);
  }

  getRecentSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/recent-sales`);
  }

  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/top-products`);
  }
}
