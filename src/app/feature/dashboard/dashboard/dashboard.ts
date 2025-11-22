import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { DashboardService } from '../../../core/services/dashboard.service';
import {
  CompleteDashboardData,
  DashboardSummary,
  LowStockItem,
  RecentCustomer,
  EmployeeSummary,
  SupplierSummary,
  SaleRecentSummary
} from '../../../core/interfaces/dashboard-interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;

  // Dashboard Data
  dashboardSummary: DashboardSummary | null = null;
  lowStockItems: LowStockItem[] = [];
  recentCustomers: RecentCustomer[] = [];
  employeeSummary: EmployeeSummary[] = [];
  supplierSummary: SupplierSummary[] = [];

  // Recent Sales Data (basado en la imagen)
  recentSales: SaleRecentSummary[] = [];

  // Calculated percentages
  salesGrowthPercentage: number = 0;
  customersGrowthPercentage: number = 0;
  productsAvailablePercentage: number = 0;
  lowStockPercentage: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    console.log('🔄 Cargando datos del dashboard desde Oracle...');

    this.dashboardService.getCompleteDashboard().subscribe({
      next: (data: CompleteDashboardData) => {
        console.log('✅ Datos del dashboard cargados desde Oracle:', data);

        this.dashboardSummary = data.summary;
        this.recentSales = data.recentSales || [];
        this.lowStockItems = data.lowStockItems || [];
        this.recentCustomers = data.recentCustomers || [];
        this.employeeSummary = data.employeeSummary || [];
        this.supplierSummary = data.supplierSummary || [];

        this.loading = false;

        // Calculate real percentages
        this.calculatePercentages();

        console.log('📊 Resumen:', this.dashboardSummary);
        console.log('🛒 Ventas recientes:', this.recentSales.length);
        console.log('⚠️ Stock bajo:', this.lowStockItems.length);
        console.log('👥 Clientes recientes:', this.recentCustomers.length);
        console.log('👔 Empleados:', this.employeeSummary.length);
        console.log('🚚 Proveedores:', this.supplierSummary.length);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar datos del dashboard desde Oracle:', error);
        console.error('Detalles del error:', error.message);
        console.error('URL del backend:', error.url);

        this.loading = false;

        // Mostrar mensaje de error al usuario
        alert(
          'Error al cargar los datos del dashboard.\n\n' +
          'Verifica que:\n' +
          '1. El backend esté corriendo en http://localhost:8085\n' +
          '2. La base de datos Oracle esté activa\n' +
          '3. Los datos estén insertados en las tablas\n\n' +
          'Error: ' + (error.message || 'Desconocido')
        );
      }
    });
  }

  // Navigation methods
  navigateToSales(): void {
    this.router.navigate(['/sales']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToSuppliers(): void {
    this.router.navigate(['/suppliers']);
  }

  navigateToStore(): void {
    this.router.navigate(['/store']);
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No definido';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE');
  }

  getUrgencyClass(urgencyLevel: string): string {
    switch (urgencyLevel) {
      case 'critical': return 'urgency-critical';
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      default: return 'urgency-low';
    }
  }

  getUrgencyIcon(urgencyLevel: string): string {
    switch (urgencyLevel) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'check_circle';
    }
  }

  getGrowthIcon(): string {
    return this.dashboardSummary && this.dashboardSummary.porcentajeVentasAyer.includes('+') ? 'trending_up' : 'trending_down';
  }

  getGrowthClass(): string {
    return this.dashboardSummary && this.dashboardSummary.porcentajeVentasAyer.includes('+') ? 'growth-positive' : 'growth-negative';
  }

  getUrgencyLevel(item: LowStockItem): string {
    const percentage = (item.currentStock / item.minimumStock) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'high';
    return 'medium';
  }

  refreshDashboard(): void {
    this.loading = true;
    this.loadDashboardData();
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Métodos específicos para mostrar datos como en las imágenes
  getEmployeeInitials(fullName: string): string {
    const names = fullName.split(' ');
    return names.length >= 2 ?
      (names[0].charAt(0) + names[1].charAt(0)).toUpperCase() :
      fullName.charAt(0).toUpperCase();
  }

  getSupplierInitials(companyName: string): string {
    const words = companyName.split(' ');
    return words.length >= 2 ?
      (words[0].charAt(0) + words[1].charAt(0)).toUpperCase() :
      companyName.charAt(0).toUpperCase();
  }

  getStatusChipClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completado':
      case 'completed':
        return 'status-completed';
      case 'pendiente':
      case 'pending':
        return 'status-pending';
      case 'a':
      case 'activo':
      case 'active':
        return 'status-active';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'a':
        return 'Activo';
      case 'i':
        return 'Inactivo';
      case 'completado':
        return 'Completado';
      case 'pendiente':
        return 'Pendiente';
      default:
        return status;
    }
  }

  // Get customer name from sale
  getCustomerName(sale: any): string {
    if (sale.customerFullName) {
      return sale.customerFullName;
    }
    if (sale.customerName && sale.customerSurname) {
      return `${sale.customerName} ${sale.customerSurname}`;
    }
    if (sale.customerName) {
      return sale.customerName;
    }
    if (sale.customer) {
      if (sale.customer.fullName) return sale.customer.fullName;
      if (sale.customer.name && sale.customer.surname) {
        return `${sale.customer.name} ${sale.customer.surname}`;
      }
      if (sale.customer.name) return sale.customer.name;
    }
    return 'Cliente no disponible';
  }

  // Calculate real percentages based on data
  calculatePercentages(): void {
    if (!this.dashboardSummary) return;

    // Sales growth (comparing recent sales)
    const totalSales = this.recentSales.length;
    const completedSales = this.recentSales.filter(s => 
      s.status?.toLowerCase() === 'completado' || s.status?.toLowerCase() === 'completed'
    ).length;
    this.salesGrowthPercentage = totalSales > 0 ? Math.round((completedSales / totalSales) * 100) : 0;

    // Customers growth (extract from summary)
    const customerPercentage = this.dashboardSummary.porcentajeClientesAyer || '0%';
    this.customersGrowthPercentage = parseFloat(customerPercentage.replace('%', '').replace('+', ''));

    // Products available percentage
    const totalProducts = this.dashboardSummary.totalProductos || 0;
    const availableProducts = this.dashboardSummary.productosDisponibles || 0;
    this.productsAvailablePercentage = totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0;

    // Low stock percentage
    this.lowStockPercentage = totalProducts > 0 ? Math.round((this.lowStockItems.length / totalProducts) * 100) : 0;
  }

  // Get total sales amount
  getTotalSalesAmount(): number {
    return this.recentSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  }

  // Get average sale amount
  getAverageSaleAmount(): number {
    const total = this.getTotalSalesAmount();
    return this.recentSales.length > 0 ? total / this.recentSales.length : 0;
  }

  // Get completion rate
  getCompletionRate(): number {
    const completed = this.recentSales.filter(s => 
      s.status?.toLowerCase() === 'completado' || s.status?.toLowerCase() === 'completed'
    ).length;
    return this.recentSales.length > 0 ? Math.round((completed / this.recentSales.length) * 100) : 0;
  }
}