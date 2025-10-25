import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { EmployeesService } from "../../../core/services/employees.service";
import { Employee, EmployeeStats, EmployeePosition, Position, Location } from "../../../core/interfaces/employees-interfaces";
import { EmployeeForm } from "../employees-form/employees-form";
import Swal from 'sweetalert2';

@Component({
  selector: "app-employees-list",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: "./employees-list.html",
  styleUrls: ["./employees-list.scss"],
})
export class EmployeesList implements OnInit {
  private dialog = inject(MatDialog);
  private employeesService = inject(EmployeesService);

  displayedColumns: string[] = [
    "empleado",
    "documento",
    "cargo",
    "contacto",
    "salario",
    "estado",
    "acciones",
  ];

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  positions: Position[] = [];
  locations: Location[] = [];
  stats: EmployeeStats = {
    total: 0,
    activos: 0,
    inactivos: 0,
    salarioPromedio: 0,
  };
  positionDistribution: EmployeePosition[] = [];

  // Filtros
  searchTerm: string = '';
  selectedStatus: string = '';

  ngOnInit(): void {
    this.loadEmployees();
    this.loadPositions();
    this.loadLocations();
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.calculateStats();
        this.calculatePositionDistribution();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        Swal.fire('Error', 'No se pudieron cargar los empleados. Verifique la conexión con el servidor.', 'error');
      }
    });
  }

  private loadPositions(): void {
    this.employeesService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions;
      },
      error: (error) => {
        console.error('Error loading positions:', error);
      }
    });
  }

  private loadLocations(): void {
    this.employeesService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  private calculateStats(): void {
    this.stats.total = this.employees.length;
    this.stats.activos = this.employees.filter(e => e.Status === 'A').length;
    this.stats.inactivos = this.employees.filter(e => e.Status === 'I').length;
    
    const totalSalary = this.employees.reduce((sum, emp) => sum + emp.Salary, 0);
    this.stats.salarioPromedio = this.employees.length > 0 ? Math.round(totalSalary / this.employees.length) : 0;
  }

  private calculatePositionDistribution(): void {
    const positionMap = new Map<number, { name: string, count: number }>();
    
    this.employees.forEach(employee => {
      const position = this.positions.find(p => p.id_Position === employee.id_Position);
      const positionName = position?.Position_Name || 'Sin cargo';
      const key = employee.id_Position;
      
      if (positionMap.has(key)) {
        positionMap.get(key)!.count++;
      } else {
        positionMap.set(key, { name: positionName, count: 1 });
      }
    });

    this.positionDistribution = Array.from(positionMap.values());
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.Surname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.Email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.Employee_Code.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || employee.Status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'A': return 'Activo';
      case 'I': return 'Inactivo';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'A': return 'status-activo';
      case 'I': return 'status-inactivo';
      default: return '';
    }
  }

  getPositionName(positionId: number): string {
    const position = this.positions.find(p => p.id_Position === positionId);
    return position?.Position_Name || 'Sin cargo';
  }

  getLocationDisplay(locationId: number): string {
    const location = this.locations.find(l => l.identifier_Location === locationId);
    if (location) {
      return `${location.district}, ${location.province}`;
    }
    return 'Sin ubicación';
  }

  openEmployeeForm(): void {
    const dialogRef = this.dialog.open(EmployeeForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { positions: this.positions, locations: this.locations }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { employee, positions: this.positions, locations: this.locations }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al empleado ${employee.Name} ${employee.Surname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && employee.id_Employee) {
        this.employeesService.deleteEmployee(employee.id_Employee).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
          }
        });
      }
    });
  }

  viewEmployee(employee: Employee): void {
    console.log("View employee:", employee);
  }

  exportReport(): void {
    this.employeesService.reportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-empleados-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        Swal.fire('Éxito', 'Reporte descargado correctamente', 'success');
      },
      error: (error) => {
        console.error('Error generating report:', error);
        Swal.fire('Información', 'Función de exportación en desarrollo', 'info');
      }
    });
  }

  sendReport(): void {
    Swal.fire({
      title: 'Enviar Reporte',
      text: 'Esta funcionalidad estará disponible próximamente',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar'
    });
  }
}
