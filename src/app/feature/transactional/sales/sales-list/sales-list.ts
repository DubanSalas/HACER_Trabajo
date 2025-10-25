import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para obtener datos de la ruta
import { Sale } from '../../../../core/interfaces/sales-interfaces'; // Asegúrate de tener esta interfaz
import { MatTableModule } from '@angular/material/table';  // Asegúrate de importar el módulo para la tabla
import { MatIconModule } from '@angular/material/icon';  // Asegúrate de importar el módulo para los íconos
import { DecimalPipe } from '@angular/common';  // Asegúrate de importar el DecimalPipe para usar el pipe number
import { MatDialog } from '@angular/material/dialog';
import { SaleForm } from '../sales-form/sales-form';  // Importa el formulario de ventas

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.html',
  styleUrls: ['./sales-list.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    DecimalPipe
  ]
})
export class SalesList implements OnInit {
  sales: Sale[] = [];
  stats = {
    ventasTotales: 0,
    ventasHoy: 0,
    completadas: 0,
    pendientes: 0
  };
  viewMode: 'list' | 'grid' = 'list';

  // Definir las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['idVenta', 'cliente', 'empleado', 'fecha', 'metodoPago', 'total', 'estado', 'acciones'];

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Obtener las ventas a través del resolver
    this.sales = this.route.snapshot.data['sales'];

    // Calcular las estadísticas
    this.calculateStats();
  }

  calculateStats() {
    this.stats.ventasTotales = this.sales.reduce((sum, sale) => sum + sale.total, 0);
    this.stats.ventasHoy = this.sales.filter(sale => new Date(sale.fecha_venta).toLocaleDateString() === new Date().toLocaleDateString())
      .reduce((sum, sale) => sum + sale.total, 0);
    this.stats.completadas = this.sales.filter(sale => sale.estado === 'Completada').length;
    this.stats.pendientes = this.sales.filter(sale => sale.estado === 'Pendiente').length;
  }

  toggleViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
  }

  openSaleForm(): void {
    this.dialog.open(SaleForm, {
      width: '700px',
      disableClose: false
    });
  }

  editSale(sale: Sale): void {
    this.dialog.open(SaleForm, {
      width: '700px',
      data: sale,
      disableClose: false
    });
  }

  deleteSale(id: string): void {
    console.log("Eliminar venta con ID:", id);
    // Lógica para eliminar la venta
  }

  viewSale(id: string): void {
    console.log("Ver venta con ID:", id);
    // Lógica para ver los detalles de la venta
  }
}
