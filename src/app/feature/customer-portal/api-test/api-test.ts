import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerProductsService } from '../../../core/services/customer-products.service';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/interfaces/customer-portal-interfaces';
import { ProductDTO } from '../../../core/interfaces/products-interfaces';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="api-test" style="padding: 24px;">
      <h1>Prueba de Conexión API</h1>
      
      <mat-card style="margin-bottom: 16px;">
        <mat-card-header>
          <mat-card-title>Productos desde Backend</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <button mat-raised-button color="primary" (click)="testBackendProducts()" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!loading">refresh</mat-icon>
            {{ loading ? 'Cargando...' : 'Cargar Productos del Backend' }}
          </button>
          
          <div *ngIf="backendProducts.length > 0" style="margin-top: 16px;">
            <h3>Productos encontrados: {{ backendProducts.length }}</h3>
            <div *ngFor="let product of backendProducts" style="border: 1px solid #ddd; padding: 8px; margin: 4px 0;">
              <strong>{{ product.productName }}</strong> - S/{{ product.price }} 
              <br><small>Stock: {{ product.stock }} | Categoría: {{ product.category }}</small>
            </div>
          </div>
          
          <div *ngIf="error" style="color: red; margin-top: 16px;">
            <strong>Error:</strong> {{ error }}
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Productos para Cliente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <button mat-raised-button color="accent" (click)="testCustomerProducts()" [disabled]="loading2">
            <mat-spinner *ngIf="loading2" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!loading2">shopping_cart</mat-icon>
            {{ loading2 ? 'Cargando...' : 'Cargar Productos para Cliente' }}
          </button>
          
          <div *ngIf="customerProducts.length > 0" style="margin-top: 16px;">
            <h3>Productos disponibles para cliente: {{ customerProducts.length }}</h3>
            <div *ngFor="let product of customerProducts" style="border: 1px solid #ddd; padding: 8px; margin: 4px 0;">
              <strong>{{ product.name }}</strong> - S/{{ product.price }} 
              <br><small>Disponible: {{ product.isAvailable ? 'Sí' : 'No' }} | Categoría: {{ product.category }}</small>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ApiTestComponent implements OnInit {
  backendProducts: ProductDTO[] = [];
  customerProducts: Product[] = [];
  loading = false;
  loading2 = false;
  error: string | null = null;

  constructor(
    private productsService: ProductsService,
    private customerProductsService: CustomerProductsService
  ) {}

  ngOnInit(): void {
    this.testBackendProducts();
  }

  testBackendProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productsService.getAll().subscribe({
      next: (products) => {
        this.backendProducts = products;
        this.loading = false;
        console.log('Backend products loaded:', products);
      },
      error: (error) => {
        this.error = `Error conectando con backend: ${error.message}`;
        this.loading = false;
        console.error('Error loading backend products:', error);
      }
    });
  }

  testCustomerProducts(): void {
    this.loading2 = true;
    
    this.customerProductsService.getAvailableProducts().subscribe({
      next: (products) => {
        this.customerProducts = products;
        this.loading2 = false;
        console.log('Customer products loaded:', products);
      },
      error: (error) => {
        console.error('Error loading customer products:', error);
        this.loading2 = false;
      }
    });
  }
}