import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductsService } from '../../../core/services/products.service';
import { EmployeesService } from '../../../core/services/employees.service';

@Component({
  selector: 'app-data-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h1>🎯 DeliPedidos - Datos Disponibles</h1>
      
      <div class="status-info">
        <p>✅ <strong>Sistema funcionando correctamente</strong></p>
        <p>📊 <strong>Datos cargados automáticamente</strong></p>
        <p>🔧 <strong>Modo: Desarrollo con datos mock</strong></p>
      </div>

      <div class="data-summary">
        <div class="data-card">
          <h3>👥 Clientes</h3>
          <p class="count">{{ customerCount }}</p>
          <button (click)="goToCustomers()" class="view-btn">Ver Lista</button>
        </div>

        <div class="data-card">
          <h3>📦 Productos</h3>
          <p class="count">{{ productCount }}</p>
          <button (click)="goToProducts()" class="view-btn">Ver Lista</button>
        </div>

        <div class="data-card">
          <h3>👨‍💼 Empleados</h3>
          <p class="count">{{ employeeCount }}</p>
          <button (click)="goToEmployees()" class="view-btn">Ver Lista</button>
        </div>

        <div class="data-card">
          <h3>💰 Ventas</h3>
          <p class="count">Disponible</p>
          <button (click)="goToSales()" class="view-btn">Ver Lista</button>
        </div>

        <div class="data-card">
          <h3>🏪 Almacén</h3>
          <p class="count">Disponible</p>
          <button (click)="goToStore()" class="view-btn">Ver Lista</button>
        </div>

        <div class="data-card">
          <h3>🚚 Proveedores</h3>
          <p class="count">Disponible</p>
          <button (click)="goToSuppliers()" class="view-btn">Ver Lista</button>
        </div>
      </div>

      <div class="quick-actions">
        <h3>🚀 Acciones Rápidas</h3>
        <button (click)="goToDashboard()" class="action-btn primary">
          📊 Ir al Dashboard
        </button>
        <button (click)="goToCustomers()" class="action-btn">
          👥 Gestionar Clientes
        </button>
        <button (click)="goToProducts()" class="action-btn">
          📦 Gestionar Productos
        </button>
      </div>

      <div class="info-note">
        <h4>ℹ️ Información:</h4>
        <p>Los datos mostrados son datos de demostración que simulan la estructura real de tu backend.</p>
        <p>Una vez configurado CORS en el backend, se conectará automáticamente a los datos reales.</p>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    h1 {
      text-align: center;
      color: #7c1d3b;
      margin-bottom: 30px;
    }

    .status-info {
      background: #d4edda;
      color: #155724;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }

    .data-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .data-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      border: 1px solid #ddd;
    }

    .data-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .count {
      font-size: 24px;
      font-weight: bold;
      color: #7c1d3b;
      margin: 10px 0;
    }

    .view-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .view-btn:hover {
      background: #0056b3;
    }

    .quick-actions {
      margin: 40px 0;
      text-align: center;
    }

    .action-btn {
      margin: 10px;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      background: #6c757d;
      color: white;
    }

    .action-btn.primary {
      background: #7c1d3b;
    }

    .action-btn:hover {
      opacity: 0.9;
    }

    .info-note {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      margin: 30px 0;
    }

    .info-note h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .info-note p {
      margin: 5px 0;
      color: #666;
    }
  `]
})
export class DataDemoComponent implements OnInit {
  customerCount = 0;
  productCount = 0;
  employeeCount = 0;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private productsService: ProductsService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit() {
    // Obtener conteos de datos
    this.customerService.customers$.subscribe(customers => {
      this.customerCount = customers.length;
    });

    this.productsService.getProducts().subscribe(products => {
      this.productCount = products.length;
    });

    this.employeesService.getEmployees().subscribe(employees => {
      this.employeeCount = employees.length;
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToEmployees() {
    this.router.navigate(['/employees']);
  }

  goToSales() {
    this.router.navigate(['/sales']);
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  goToSuppliers() {
    this.router.navigate(['/suppliers']);
  }
}