import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SalesService } from '../../../core/services/sales.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaleDTO } from '../../../core/interfaces/sales-interfaces';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './sales-detail.html',
  styleUrls: ['./sales-detail.scss']
})
export class SalesDetailComponent implements OnInit {
  sale: SaleDTO | null = null;
  loading = false;
  saleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.saleId = +params['id'];
        this.loadSaleDetail();
      }
    });
  }

  loadSaleDetail(): void {
    if (!this.saleId) return;

    this.loading = true;
    this.salesService.getById(this.saleId).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sale detail:', error);
        this.notificationService.operationError('cargar', 'detalle de venta', error.error?.message);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }

  viewReceipt(): void {
    if (this.sale) {
      this.router.navigate(['/sales/receipt', this.sale.idSale]);
    }
  }

  editSale(): void {
    if (this.sale) {
      this.router.navigate(['/sales/edit', this.sale.idSale]);
    }
  }

  duplicateSale(): void {
    if (this.sale) {
      // Implementar lógica de duplicación
      this.notificationService.info('Funcionalidad de duplicación en desarrollo');
    }
  }

  printSale(): void {
    if (this.sale) {
      // Navegar a la boleta con parámetro de impresión automática
      this.router.navigate(['/sales/receipt', this.sale.idSale], {
        queryParams: { print: 'true' }
      });
    }
  }

  deleteSale(): void {
    if (!this.sale) return;

    const confirmMessage = `¿Estás seguro de que deseas eliminar la venta ${this.sale.saleCode}?`;
    if (confirm(confirmMessage)) {
      this.salesService.delete(this.sale.idSale).subscribe({
        next: () => {
          this.notificationService.operationSuccess('eliminación', `venta ${this.sale!.saleCode}`);
          this.router.navigate(['/sales']);
        },
        error: (error) => {
          this.notificationService.operationError('eliminar', 'venta', error.error?.message);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'status-completed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelado':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'check_circle';
      case 'pendiente':
        return 'schedule';
      case 'cancelado':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getPaymentMethodIcon(method: string): string {
    switch (method?.toLowerCase()) {
      case 'efectivo':
        return '💵';
      case 'tarjeta de débito':
      case 'tarjeta de crédito':
        return '💳';
      case 'yape':
        return '📱';
      case 'plin':
        return '📲';
      case 'transferencia':
        return '🏦';
      default:
        return '💰';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateSubtotal(): number {
    if (!this.sale?.details) return 0;
    return this.sale.details.reduce((sum, detail) => sum + (detail.quantity * detail.unitPrice), 0);
  }

  calculateTax(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal * 0.18; // IGV 18%
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }
}