import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="simple-dashboard">
      <div class="header">
        <h1>Dashboard - DeliPedidos</h1>
        <p>Sistema de Panadería</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ stats.ventas }}</h3>
            <p>Ventas del Día</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.clientes }}</h3>
            <p>Total Clientes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ stats.productos }}</h3>
            <p>Productos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👨‍💼</div>
          <div class="stat-content">
            <h3>{{ stats.empleados }}</h3>
            <p>Empleados</p>
          </div>
        </div>
      </div>
      
      <div class="content-grid">
        <div class="card">
          <h2>Ventas Recientes</h2>
          <div class="sales-list">
            <div class="sale-item" *ngFor="let sale of recentSales">
              <div class="sale-info">
                <strong>{{ sale.codigo }}</strong>
                <span>{{ sale.cliente }}</span>
              </div>
              <div class="sale-amount">S/ {{ sale.total }}</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2>Estado del Sistema</h2>
          <div class="system-status">
            <div class="status-item">
              <span class="status-dot active"></span>
              <span>Backend: Conectado</span>
            </div>
            <div class="status-item">
              <span class="status-dot active"></span>
              <span>Base de Datos: Activa</span>
            </div>
            <div class="status-item">
              <span class="status-dot active"></span>
              <span>Sistema: Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .simple-dashboard {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    
    .header p {
      color: #666;
      font-size: 1.2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .stat-icon {
      font-size: 2rem;
    }
    
    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }
    
    .stat-content p {
      margin: 5px 0 0 0;
      color: #666;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .card h2 {
      margin-top: 0;
      color: #333;
    }
    
    .sale-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .sale-amount {
      font-weight: bold;
      color: #28a745;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #28a745;
    }
    
    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SimpleDashboardComponent {
  stats = {
    ventas: 15,
    clientes: 125,
    productos: 45,
    empleados: 8
  };

  recentSales = [
    { codigo: 'V001', cliente: 'Pedro García', total: 25.50 },
    { codigo: 'V002', cliente: 'María López', total: 18.75 },
    { codigo: 'V003', cliente: 'Juan Pérez', total: 32.00 },
    { codigo: 'V004', cliente: 'Ana Martín', total: 15.25 },
    { codigo: 'V005', cliente: 'Carlos Ruiz', total: 28.90 }
  ];
}