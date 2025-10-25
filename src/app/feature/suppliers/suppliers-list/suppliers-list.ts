import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { SuppliersService } from "../../../core/services/suppliers.service";
import { Supplier, SupplierStats, SupplierCategory, Location } from "../../../core/interfaces/suppliers-interfaces";
import { SupplierForm } from "../suppliers-form/suppliers-form";
import Swal from 'sweetalert2';

@Component({
  selector: "app-suppliers-list",
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
  templateUrl: "./suppliers-list.html",
  styleUrls: ["./suppliers-list.scss"],
})
export class SuppliersList implements OnInit {
  private dialog = inject(MatDialog);
  private suppliersService = inject(SuppliersService);

  displayedColumns: string[] = [
    "empresa",
    "contacto",
    "categoria",
    "comunicacion",
    "terminos",
    "pedidos",
    "estado",
    "acciones",
  ];

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  locations: Location[] = [];
  stats: SupplierStats = {
    total: 0,
    activos: 0,
    inactivos: 0,
    suspendidos: 0,
  };
  categories: SupplierCategory[] = [];

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadLocations();
  }

  private loadSuppliers(): void {
    this.suppliersService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.filteredSuppliers = suppliers;
        this.calculateStats();
        this.calculateCategories();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        // Mostrar mensaje de error al usuario
        Swal.fire('Error', 'No se pudieron cargar los proveedores. Verifique la conexión con el servidor.', 'error');
      }
    });
  }

  private loadLocations(): void {
    this.suppliersService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        // Mostrar mensaje de error si es necesario
        console.warn('No se pudieron cargar las ubicaciones');
      }
    });
  }



  private calculateStats(): void {
    this.stats.total = this.suppliers.length;
    this.stats.activos = this.suppliers.filter(s => s.Status === 'A').length;
    this.stats.inactivos = this.suppliers.filter(s => s.Status === 'I').length;
    this.stats.suspendidos = this.suppliers.filter(s => s.Status === 'S').length;
  }

  private calculateCategories(): void {
    const categoryMap = new Map<string, number>();
    this.suppliers.forEach(supplier => {
      const count = categoryMap.get(supplier.Category) || 0;
      categoryMap.set(supplier.Category, count + 1);
    });

    this.categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  }

  applyFilters(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const matchesSearch = !this.searchTerm || 
        supplier.Company_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.Contact_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.Email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || supplier.Category === this.selectedCategory;
      const matchesStatus = !this.selectedStatus || supplier.Status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'A': return 'Activo';
      case 'I': return 'Inactivo';
      case 'S': return 'Suspendido';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'A': return 'status-activo';
      case 'I': return 'status-inactivo';
      case 'S': return 'status-suspendido';
      default: return '';
    }
  }

  openSupplierForm(): void {
    const dialogRef = this.dialog.open(SupplierForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { locations: this.locations }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  editSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(SupplierForm, {
      width: "900px",
      maxWidth: "95vw",
      disableClose: true,
      data: { supplier, locations: this.locations }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  deleteSupplier(supplier: Supplier): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al proveedor ${supplier.Company_Name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && supplier.id_Supplier) {
        this.suppliersService.deleteSupplier(supplier.id_Supplier).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El proveedor ha sido eliminado.', 'success');
            this.loadSuppliers();
          },
          error: (error) => {
            console.error('Error deleting supplier:', error);
            Swal.fire('Error', 'No se pudo eliminar el proveedor.', 'error');
          }
        });
      }
    });
  }

  viewSupplier(supplier: Supplier): void {
    // Implementar vista de detalles si es necesario
    console.log("View supplier:", supplier);
  }

  exportReport(): void {
    this.suppliersService.reportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-proveedores-${new Date().toISOString().split('T')[0]}.pdf`;
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
    // Implementar envío de reporte por email
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
