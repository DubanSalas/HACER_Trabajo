import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SalesService } from '../../../core/services/sales.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SaleDTO } from '../../../core/interfaces/sales-interfaces';

@Component({
  selector: 'app-sales-receipt',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './sales-receipt.html',
  styleUrls: ['./sales-receipt.scss']
})
export class SalesReceiptComponent implements OnInit, AfterViewInit {
  sale: SaleDTO | null = null;
  loading = false;
  saleId: number | null = null;
  currentDate = new Date();
  shouldPrint = false;

  // Información de la empresa
  companyInfo = {
    name: 'PANADERÍA DELIPEDIDOS',
    ruc: '20123456789',
    address: 'Av. Principal 123, Lima - Perú',
    phone: '(01) 234-5678',
    email: 'ventas@delipedidos.com'
  };

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

    // Verificar si debe imprimir automáticamente
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['print'] === 'true') {
        this.shouldPrint = true;
      }
    });
  }

  ngAfterViewInit(): void {
    // Si debe imprimir y la venta ya está cargada, imprimir
    if (this.shouldPrint && this.sale && !this.loading) {
      setTimeout(() => {
        this.printReceipt();
      }, 1000);
    }
  }

  loadSaleDetail(): void {
    if (!this.saleId) return;

    this.loading = true;
    this.salesService.getById(this.saleId).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.loading = false;

        // Si debe imprimir, hacerlo después de cargar
        if (this.shouldPrint) {
          setTimeout(() => {
            this.printReceipt();
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Error loading sale detail:', error);
        this.notificationService.operationError('cargar', 'boleta', error.error?.message);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/sales', this.saleId]);
  }

  printReceipt(): void {
    window.print();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
    return subtotal * 0.18;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  convertNumberToWords(num: number): string {
    const units = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    if (num === 0) return 'CERO';
    if (num === 100) return 'CIEN';

    let words = '';
    let integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    if (integerPart >= 1000) {
      const thousands = Math.floor(integerPart / 1000);
      if (thousands === 1) {
        words += 'MIL ';
      } else {
        words += this.convertNumberToWords(thousands) + ' MIL ';
      }
      const remainder = integerPart % 1000;
      if (remainder > 0) {
        words += this.convertNumberToWords(remainder);
      }
    } else {
      if (integerPart >= 100) {
        words += hundreds[Math.floor(integerPart / 100)] + ' ';
        integerPart %= 100;
      }
      if (integerPart >= 20) {
        words += tens[Math.floor(integerPart / 10)];
        if (integerPart % 10 > 0) {
          words += ' Y ' + units[integerPart % 10];
        }
      } else if (integerPart >= 10) {
        words += teens[integerPart - 10];
      } else if (integerPart > 0) {
        words += units[integerPart];
      }
    }

    return `${words.trim()} CON ${decimalPart.toString().padStart(2, '0')}/100 SOLES`;
  }
}
