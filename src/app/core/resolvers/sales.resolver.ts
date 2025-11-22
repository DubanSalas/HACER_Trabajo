import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SalesService } from '../services/sales.service';
import { SaleDTO } from '../interfaces/sales-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalesResolver implements Resolve<SaleDTO[]> {
  
  constructor(private salesService: SalesService) {}

  resolve(): Observable<SaleDTO[]> {
    return this.salesService.getAll();
  }
}