import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerService } from '../services/customer.service';
import { CustomerDTO } from '../interfaces/customer-interfaces';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerResolver implements Resolve<CustomerDTO | null> {

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CustomerDTO | null> {
    
    const id = route.paramMap.get('id');
    
    if (!id || id === 'new') {
      return of(null);
    }

    return this.customerService.getById(+id).pipe(
      catchError(error => {
        console.error('Error loading customer:', error);
        this.notificationService.error('Error al cargar los datos del cliente');
        this.router.navigate(['/customers']);
        return EMPTY;
      })
    );
  }
}