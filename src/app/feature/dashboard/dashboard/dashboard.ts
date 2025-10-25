import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Ensure CommonModule is imported
import { MatIconModule } from '@angular/material/icon'; // If using Material Icons
import { MatButtonModule } from '@angular/material/button'; // If using Material Buttons

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface RecentSale {
  name: string;
  products: number;
  amount: string;
  status: string;
}

interface TopProduct {
  name: string;
  sales: number;
  status: string;
}

interface StockAlert {
  name: string;
  current: number;
  unit: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,  // Ensure this module is imported for ngFor
    MatIconModule, // If using Material Icons
    MatButtonModule, // If using Material Buttons
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  statCards: StatCard[] = [
    {
      title: 'Ventas del Día',
      value: 10,
      icon: '🛍️',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Total de Cliente',
      value: 10,
      icon: '👤',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Total de Empleado',
      value: 10,
      icon: '👥',
      color: '#a78bfa',
      bgColor: '#ede9fe',
    },
    {
      title: 'Total de Producto',
      value: 10,
      icon: '📦',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
  ];

  recentSales: RecentSale[] = [
    { name: 'María González', products: 3, amount: '$154.5', status: 'completado' },
    { name: 'Ana Martín', products: 2, amount: '$96.0', status: 'completado' },
    { name: 'María González', products: 3, amount: '$154.5', status: 'completado' },
  ];

  topProducts: TopProduct[] = [
    { name: 'Pan Integral', sales: 45, status: 'vendidos' },
    { name: 'Pan Integral', sales: 45, status: 'vendidos' },
    { name: 'Pan Integral', sales: 45, status: 'vendidos' },
  ];

  stockAlerts: StockAlert[] = [
    { name: 'Torta de Chocolate', current: 13, unit: 'unidades' },
    { name: 'Torta de Chocolate', current: 13, unit: 'unidades' },
    { name: 'Torta de Chocolate', current: 13, unit: 'unidades' },
    { name: 'Torta de Chocolate', current: 13, unit: 'unidades' },
  ];

  ngOnInit(): void {
    // Initialize any other necessary data if needed
  }
}
