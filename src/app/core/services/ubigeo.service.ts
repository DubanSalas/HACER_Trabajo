import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('assets/ubigeo/departamentos.json');
  }

  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>('assets/ubigeo/provincias.json');
  }

  getDistricts(): Observable<any[]> {
    return this.http.get<any[]>('assets/ubigeo/distritos.json');
  }
}
