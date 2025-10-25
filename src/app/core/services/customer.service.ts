import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Customer, CustomerRequest, CustomerSummary } from '../interfaces/customer-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly url = `${environment.urlBackEnd}/v1/api/customer`;

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private statsSubject = new BehaviorSubject<CustomerSummary>({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    newThisMonth: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public customers$ = this.customersSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  private loadInitialData(): void {
    console.log('🚀 Initializing customer service...');
    this.getCustomers().subscribe({
      next: (customers) => {
        console.log('🎉 Initial data loaded successfully');
      },
      error: (error) => {
        console.error('❌ Failed to load initial data:', error);
      }
    });
  }

  // Obtener todos los clientes
  getCustomers(): Observable<Customer[]> {
    this.loadingSubject.next(true);
    console.log('🔄 Calling backend URL:', this.url);

    return this.http.get<Customer[]>(`${environment.urlBackEnd}/v1/api/customers-simple`).pipe(
      tap(customers => {
        console.log('✅ Backend data received:', customers.length, 'customers');
        this.customersSubject.next(customers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error connecting to backend:', error);
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  // Obtener cliente por ID
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching customer:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener cliente por código
  getCustomerByClientCode(clientCode: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/client-code/${clientCode}`).pipe(
      catchError(error => {
        console.error('Error fetching customer by client code:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener clientes por estado
  getCustomersByStatus(status: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/status/${status}`).pipe(
      catchError(error => {
        console.error('Error fetching customers by status:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener clientes por departamento
  getCustomersByDepartment(department: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/department/${department}`).pipe(
      catchError(error => {
        console.error('Error fetching customers by department:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener clientes por provincia
  getCustomersByProvince(province: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/province/${province}`).pipe(
      catchError(error => {
        console.error('Error fetching customers by province:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener clientes por distrito
  getCustomersByDistrict(district: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/district/${district}`).pipe(
      catchError(error => {
        console.error('Error fetching customers by district:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener clientes por ubicación
  getCustomersByLocation(locationId: number): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/location/${locationId}`).pipe(
      catchError(error => {
        console.error('Error fetching customers by location:', error);
        return throwError(() => error);
      })
    );
  }

  // Buscar clientes
  searchCustomers(search: string, status: string = 'A'): Observable<Customer[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('status', status);

    return this.http.get<Customer[]>(`${this.url}/search`, { params }).pipe(
      tap(customers => {
        this.customersSubject.next(customers);
      }),
      catchError(error => {
        console.error('Error searching customers:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener resumen/estadísticas - Calcular desde los datos existentes
  getSummary(): Observable<CustomerSummary> {
    const customers = this.customersSubject.value;
    const summary: CustomerSummary = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'A').length,
      inactiveCustomers: customers.filter(c => c.status === 'I').length,
      newThisMonth: customers.filter(c => {
        const registerDate = new Date(c.registerDate || '');
        const now = new Date();
        return registerDate.getMonth() === now.getMonth() &&
          registerDate.getFullYear() === now.getFullYear();
      }).length
    };

    console.log('📊 Summary calculated from backend data:', summary);
    this.statsSubject.next(summary);
    return of(summary);
  }

  // Crear cliente
  createCustomer(customer: CustomerRequest): Observable<Customer> {
    this.loadingSubject.next(true);

    return this.http.post<Customer>(`${this.url}/save`, customer).pipe(
      tap(newCustomer => {
        const currentCustomers = this.customersSubject.value;
        this.customersSubject.next([newCustomer, ...currentCustomers]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error creating customer:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar cliente
  updateCustomer(id: number, customer: CustomerRequest): Observable<Customer> {
    this.loadingSubject.next(true);

    return this.http.put<Customer>(`${this.url}/update/${id}`, customer).pipe(
      tap(updatedCustomer => {
        const currentCustomers = this.customersSubject.value;
        const index = currentCustomers.findIndex(c => c.idCustomer === id);
        if (index !== -1) {
          currentCustomers[index] = updatedCustomer;
          this.customersSubject.next([...currentCustomers]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error updating customer:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar cliente (soft delete)
  deleteCustomer(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.http.patch<void>(`${this.url}/delete/${id}`, {}).pipe(
      tap(() => {
        const currentCustomers = this.customersSubject.value;
        const updatedCustomers = currentCustomers.map(customer =>
          customer.idCustomer === id ? { ...customer, status: 'I' } : customer
        );
        this.customersSubject.next(updatedCustomers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error deleting customer:', error);
        return throwError(() => error);
      })
    );
  }

  // Restaurar cliente
  restoreCustomer(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.http.patch<void>(`${this.url}/restore/${id}`, {}).pipe(
      tap(() => {
        const currentCustomers = this.customersSubject.value;
        const updatedCustomers = currentCustomers.map(customer =>
          customer.idCustomer === id ? { ...customer, status: 'A' } : customer
        );
        this.customersSubject.next(updatedCustomers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error restoring customer:', error);
        return throwError(() => error);
      })
    );
  }

  // Verificar si existe código de cliente
  existsByClientCode(clientCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/exists/client-code/${clientCode}`).pipe(
      catchError(error => {
        console.error('Error checking client code:', error);
        return throwError(() => error);
      })
    );
  }

  // Verificar si existe número de documento
  existsByDocumentNumber(documentNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/exists/document/${documentNumber}`).pipe(
      catchError(error => {
        console.error('Error checking document number:', error);
        return throwError(() => error);
      })
    );
  }

  // Verificar si existe email
  existsByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/exists/email/${email}`).pipe(
      catchError(error => {
        console.error('Error checking email:', error);
        return throwError(() => error);
      })
    );
  }

  // Generar siguiente código de cliente
  generateNextClientCode(): Observable<string> {
    return this.http.get<string>(`${this.url}/generate-code`).pipe(
      catchError(error => {
        console.error('Error generating client code:', error);
        return throwError(() => error);
      })
    );
  }

  // Generar reporte PDF
  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.url}/pdf`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error generating PDF report:', error);
        return throwError(() => error);
      })
    );
  }

  // Limpiar datos
  clearData(): void {
    this.customersSubject.next([]);
    this.statsSubject.next({
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      newThisMonth: 0
    });
  }

  // Obtener departamentos únicos
  getDepartments(): string[] {
    const customers = this.customersSubject.value;
    const departments = [...new Set(customers.map(customer => customer.department))];
    return departments.filter(dept => dept).sort();
  }

  // Obtener provincias únicas
  getProvinces(): string[] {
    const customers = this.customersSubject.value;
    const provinces = [...new Set(customers.map(customer => customer.province))];
    return provinces.filter(prov => prov).sort();
  }

  // Obtener distritos únicos
  getDistricts(): string[] {
    const customers = this.customersSubject.value;
    const districts = [...new Set(customers.map(customer => customer.district))];
    return districts.filter(dist => dist).sort();
  }

}