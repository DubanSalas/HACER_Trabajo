import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, Position, Location, EmployeeFormData } from '../interfaces/employees-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private readonly url = `${environment.urlBackEnd}/v1/api/employee`;
  private readonly positionUrl = `${environment.urlBackEnd}/v1/api/position`;
  private readonly locationUrl = `${environment.urlBackEnd}/v1/api/location`;

  constructor(private http: HttpClient) { }

  // Empleado seleccionado
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

  setSelectedEmployee(employee: Employee | null): void {
    this.selectedEmployeeSubject.next(employee);
  }

  // CRUD empleados
  findByStatus(status: 'A' | 'I'): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}/status/${status}`);
  }

  // Obtener todos los empleados
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}`);
  }

  // Obtener empleado por ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }

  // Crear nuevo empleado
  create(employee: EmployeeFormData): Observable<Employee> {
    return this.http.post<Employee>(`${this.url}/save`, employee);
  }

  // Actualizar empleado
  update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.url}/update/${employee.id_Employee}`, employee);
  }

  // Eliminar empleado (cambiar status a inactivo)
  delete(idEmployee: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${idEmployee}`);
  }

  // Restaurar empleado (cambiar status a activo)
  restore(idEmployee: number): Observable<void> {
    return this.http.put<void>(`${this.url}/restore/${idEmployee}`, {});
  }

  // Generar reporte PDF de empleados
  reportPdf(): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf`, { responseType: 'blob' as 'json' });
  }

  // Generar reporte PDF filtrado por cargo
  reportPdfByPosition(positionId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.url}/pdf/position/${positionId}`, { responseType: 'blob' as 'json' });
  }

  // Obtener posiciones/cargos (datos temporales hasta implementar en backend)
  getPositions(): Observable<Position[]> {
    const positions: Position[] = [
      { id_Position: 1, Position_Name: 'Gerente', Description: 'Gerente general', Status: 'A' },
      { id_Position: 2, Position_Name: 'Panadero', Description: 'Especialista en panadería', Status: 'A' },
      { id_Position: 3, Position_Name: 'Cajero', Description: 'Encargado de caja', Status: 'A' },
      { id_Position: 4, Position_Name: 'Vendedor', Description: 'Vendedor de productos', Status: 'A' },
      { id_Position: 5, Position_Name: 'Repostero', Description: 'Especialista en repostería', Status: 'A' }
    ];
    return new Observable(observer => {
      observer.next(positions);
      observer.complete();
    });
  }

  // Obtener ubicaciones (datos temporales hasta implementar en backend)
  getLocations(): Observable<Location[]> {
    const locations: Location[] = [
      { identifier_Location: 1, department: 'Lima', province: 'Lima', district: 'Lima', address: 'Av. Principal 123' },
      { identifier_Location: 2, department: 'Lima', province: 'Lima', district: 'Miraflores', address: 'Av. Larco 456' },
      { identifier_Location: 3, department: 'Lima', province: 'Lima', district: 'San Isidro', address: 'Av. Javier Prado 789' },
      { identifier_Location: 4, department: 'Lima', province: 'Lima', district: 'Surco', address: 'Av. Benavides 321' },
      { identifier_Location: 5, department: 'Arequipa', province: 'Arequipa', district: 'Cercado', address: 'Calle Mercaderes 111' }
    ];
    return new Observable(observer => {
      observer.next(locations);
      observer.complete();
    });
  }

  // Filtros por cargo
  getByPosition(positionId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}/position/${positionId}`);
  }

  // Filtros por ubicación
  getByLocation(locationId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}/location/${locationId}`);
  }

  // Métodos de conveniencia para mantener compatibilidad
  createEmployee(employee: EmployeeFormData): Observable<Employee> {
    return this.create(employee);
  }

  updateEmployee(id: number, employeeData: EmployeeFormData): Observable<Employee> {
    const employee: Employee = {
      id_Employee: id,
      ...employeeData,
      Status: employeeData.Status || 'A'
    };
    return this.update(employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.delete(id);
  }
}
