// src/app/core/resolvers/customers.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Customer } from '../interfaces/customer-interfaces';
import { CustomerService } from '../services/customer.service';

export const customersResolver: ResolveFn<Customer[]> = () => {
  const service = inject(CustomerService);
  // por defecto lista Activos para iniciar el dashboard
  return service.getCustomersByStatus('A');
};
