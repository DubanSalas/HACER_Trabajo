import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeDTO, EmployeeRequest, PositionDTO, EmployeeSummary } from '../interfaces/employees-interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/employee`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.apiUrl}/${id}`);
  }

  getByEmployeeCode(employeeCode: string): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.apiUrl}/code/${employeeCode}`);
  }

  getByStatus(status: string): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getByPosition(positionId: number): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/position/${positionId}`);
  }

  search(searchTerm: string, status: string = 'A'): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/search?search=${searchTerm}&status=${status}`);
  }

  getSummary(): Observable<EmployeeSummary> {
    return this.http.get<EmployeeSummary>(`${this.apiUrl}/summary`);
  }

  create(employee: EmployeeRequest): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(`${this.apiUrl}/save`, employee);
  }

  update(id: number, employee: EmployeeRequest): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.apiUrl}/update/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
  }

  generateNextEmployeeCode(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/generate-code`);
  }

  existsByEmployeeCode(employeeCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/code/${employeeCode}`);
  }

  existsByDocumentNumber(documentNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/document/${documentNumber}`);
  }

  existsByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/email/${email}`);
  }

  generatePdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }

  // Position methods
  getAllPositions(): Observable<PositionDTO[]> {
    return this.http.get<PositionDTO[]>(`${environment.urlBackEnd}/v1/api/position`);
  }

  getPositionById(id: number): Observable<PositionDTO> {
    return this.http.get<PositionDTO>(`${environment.urlBackEnd}/v1/api/position/${id}`);
  }
}