import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.urlBackEnd}/api/locations`;
  private cacheTTL = 30 * 60 * 1000; // 30 minutos para datos de ubicación

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  getAllDepartments(): Observable<string[]> {
    const cacheKey = 'departments';
    const request = this.http.get<string[]>(`${this.apiUrl}/departments`);
    return this.cacheService.cacheObservable(cacheKey, request, this.cacheTTL);
  }

  getProvincesByDepartment(department: string): Observable<string[]> {
    const cacheKey = `provinces_${department}`;
    const params = new HttpParams().set('department', department);
    const request = this.http.get<string[]>(`${this.apiUrl}/provinces`, { params });
    return this.cacheService.cacheObservable(cacheKey, request, this.cacheTTL);
  }

  getDistrictsByProvince(province: string): Observable<string[]> {
    const cacheKey = `districts_${province}`;
    const params = new HttpParams().set('province', province);
    const request = this.http.get<string[]>(`${this.apiUrl}/districts`, { params });
    return this.cacheService.cacheObservable(cacheKey, request, this.cacheTTL);
  }

  // Método para limpiar cache de ubicaciones
  clearLocationCache(): void {
    // Limpiar cache específico de ubicaciones
    const keys = ['departments'];
    keys.forEach(key => this.cacheService.delete(key));
    
    // También podríamos limpiar todo el cache si es necesario
    // this.cacheService.clear();
  }
}