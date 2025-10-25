// src/app/core/resolvers/sales.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SalesService } from '../services/sales.service'; // Asegúrate de tener este servicio
import { Sale, SaleWithDetails } from '../interfaces/sales-interfaces';// Asegúrate de tener esta interfaz

@Injectable({
  providedIn: 'root'
})
export class SalesResolver implements Resolve<SaleWithDetails[]> {
  constructor(private salesService: SalesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SaleWithDetails[]> {
    return this.salesService.getSales(); // Aquí obtenemos las ventas
  }
}
