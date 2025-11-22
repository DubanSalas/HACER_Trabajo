import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../interfaces/products-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsResolver implements Resolve<ProductDTO[]> {
  
  constructor(private productsService: ProductsService) {}

  resolve(): Observable<ProductDTO[]> {
    return this.productsService.getAll();
  }
}