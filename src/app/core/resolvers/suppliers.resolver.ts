import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SuppliersService } from '../services/suppliers.service';
import { Supplier } from '../interfaces/suppliers-interfaces';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SuppliersResolver implements Resolve<Supplier[]> {
  constructor(private suppliersService: SuppliersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Supplier[]> {
    return this.suppliersService.getSuppliers().pipe(
      catchError(error => {
        console.error('Error loading suppliers in resolver:', error);
        // Retornar array vacío en caso de error
        return of([]);
      })
    );
  }
}
