import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { CustomerDTO } from '../interfaces/customer-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CustomersResolver implements Resolve<CustomerDTO[]> {
  
  constructor(private customerService: CustomerService) {}

  resolve(): Observable<CustomerDTO[]> {
    return this.customerService.getAll();
  }
}