import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { EmployeesService } from '../../../core/services/employees.service';
import { EmployeeDTO, EmployeeSummary } from '../../../core/interfaces/employees-interfaces';
import { NotificationService } from '../../../core/services/notification.service';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './employees-list.html',
  styleUrls: ['./employees-list.scss']
})
export class EmployeesListComponent implements OnInit {
  employees: EmployeeDTO[] = [];
  filteredEmployees: EmployeeDTO[] = [];
  summary: EmployeeSummary | null = null;
  loading = false;
  filterConfig: FilterConfig;
  departments: string[] = [];
  searchTerm = '';
  
  // Detail modal properties
  showDetailModal = false;
  selectedEmployee: EmployeeDTO | null = null;

  // Filtros
  statusOptions = [
    { value: 'A', label: 'Activos' },
    { value: 'I', label: 'Inactivos' },
    { value: '', label: 'Todos' }
  ];

  constructor(
    private employeesService: EmployeesService,
    private router: Router,
    private notificationService: NotificationService,
    private filterService: FilterService
  ) {
    this.filterConfig = this.filterService.getEmployeeFilterConfig();
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadSummary();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeesService.getAll().subscribe({
      next: (data) => {
        console.log('Employees loaded from backend:', data);
        this.employees = data || [];
        this.extractDepartments();
        this.applyFilters();
        this.loading = false;
        
        if (this.employees.length === 0) {
          this.notificationService.noDataFound('empleados');
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.filteredEmployees = [];
        this.loading = false;
        this.notificationService.operationError('cargar', 'empleados', error.error?.message || error.message);
      }
    });
  }

  extractDepartments(): void {
    this.departments = [...new Set(this.employees.map(emp => emp.positionName || 'Sin departamento'))].sort();
  }

  loadSummary(): void {
    this.employeesService.getSummary().subscribe({
      next: (data) => {
        console.log('Summary loaded from backend:', data);
        this.summary = data;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        // Crear un resumen por defecto basado en los empleados cargados
        if (this.employees && this.employees.length > 0) {
          const activeEmployees = this.employees.filter(emp => emp.status === 'A').length;
          const inactiveEmployees = this.employees.filter(emp => emp.status === 'I').length;
          const totalSalary = this.employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
          const averageSalary = totalSalary / this.employees.length;
          
          this.summary = {
            totalEmployees: this.employees.length,
            activeEmployees: activeEmployees,
            inactiveEmployees: inactiveEmployees,
            averageSalary: averageSalary
          };
        }
      }
    });
  }

  applyFilters(): void {
    if (!this.employees) {
      this.filteredEmployees = [];
      return;
    }
    
    // Aplicar filtros básicos primero
    let filtered = [...this.employees];
    
    // Filtro por término de búsqueda
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.surname.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.employeeCode.toLowerCase().includes(term) ||
        emp.documentNumber.includes(term) ||
        emp.positionName.toLowerCase().includes(term)
      );
    }
    
    this.filteredEmployees = filtered;
  }

  // Método para manejar cambios en filtros avanzados
  onFiltersChanged(event: any): void {
    console.log('Filters changed:', event);
    this.searchTerm = event.searchTerm || '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterService.clearFilters();
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  refreshData(): void {
    this.loadEmployees();
    this.loadSummary();
  }

  getStatusClass(status: string): string {
    return status === 'A' ? 'active' : 'inactive';
  }

  getStatusText(status: string): string {
    return status === 'A' ? 'Activo' : 'Inactivo';
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(salary);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  viewEmployee(employee: EmployeeDTO): void {
    this.selectedEmployee = employee;
    this.showDetailModal = true;
  }

  editEmployee(employee: EmployeeDTO): void {
    this.router.navigate(['/employees/edit', employee.idEmployee]);
  }

  deleteEmployee(employee: EmployeeDTO): void {
    if (confirm(`¿Estás seguro de que deseas desactivar al empleado "${employee.name} ${employee.surname}"?`)) {
      this.employeesService.delete(employee.idEmployee).subscribe({
        next: () => {
          this.notificationService.employeeDeactivated(`${employee.name} ${employee.surname}`);
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.notificationService.operationError('desactivar', 'empleado', error.error?.message);
        }
      });
    }
  }

  restoreEmployee(employee: EmployeeDTO): void {
    if (confirm(`¿Estás seguro de que deseas reactivar al empleado "${employee.name} ${employee.surname}"?`)) {
      this.employeesService.restore(employee.idEmployee).subscribe({
        next: () => {
          this.notificationService.employeeRestored(`${employee.name} ${employee.surname}`);
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error restoring employee:', error);
          this.notificationService.operationError('reactivar', 'empleado', error.error?.message);
        }
      });
    }
  }

  generateReport(employee?: EmployeeDTO): void {
    if (employee) {
      console.log('Generating report for employee:', employee);
      // TODO: Implementar reporte individual
    } else {
      this.employeesService.generatePdfReport().subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte-empleados.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error generating report:', error);
        }
      });
    }
  }

  trackByEmployeeId(index: number, employee: EmployeeDTO): number {
    return employee.idEmployee;
  }

  toggleStatus(employee: EmployeeDTO): void {
    const newStatus = employee.status === 'A' ? 'I' : 'A';
    const action = newStatus === 'A' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Está seguro de ${action} al empleado ${employee.name} ${employee.surname}?`)) {
      // TODO: Implementar cambio de estado
      console.log(`Toggle status for employee:`, employee);
    }
  }

  viewHistory(employee: EmployeeDTO): void {
    console.log('View history for employee:', employee);
    // TODO: Implementar historial de empleado
  }

  // Navigation methods
  navigateToCreate(): void {
    this.router.navigate(['/employees/create']);
  }

  // Detail modal methods
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  getEmployeeInitials(employee: EmployeeDTO): string {
    const firstName = employee.name.charAt(0).toUpperCase();
    const lastName = employee.surname.charAt(0).toUpperCase();
    return firstName + lastName;
  }

  editFromModal(): void {
    if (this.selectedEmployee && this.selectedEmployee.idEmployee) {
      this.closeDetailModal();
      this.editEmployee(this.selectedEmployee);
    }
  }

  deleteFromModal(): void {
    if (this.selectedEmployee) {
      this.deleteEmployee(this.selectedEmployee);
      this.closeDetailModal();
    }
  }

  restoreFromModal(): void {
    if (this.selectedEmployee) {
      this.restoreEmployee(this.selectedEmployee);
      this.closeDetailModal();
    }
  }

  generateEmployeeReport(employee: EmployeeDTO): void {
    console.log('Generating individual report for employee:', employee);
    this.notificationService.info(`Generando reporte para "${employee.name} ${employee.surname}"`);
  }

  sendEmail(employee: EmployeeDTO): void {
    if (employee.email) {
      window.open(`mailto:${employee.email}?subject=Contacto desde DeliciousBakery`, '_blank');
    }
  }

  callPhone(employee: EmployeeDTO): void {
    if (employee.phone) {
      window.open(`tel:${employee.phone}`, '_blank');
    }
  }
}