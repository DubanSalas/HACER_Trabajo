import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list').then(m => m.ProductListComponent),
    data: { 
      title: 'Lista de Productos',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./product-form/product-form').then(m => m.ProductFormComponent),
    data: { 
      title: 'Nuevo Producto',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./product-form/product-form').then(m => m.ProductFormComponent),
    data: { 
      title: 'Editar Producto',
      roles: ['ADMIN', 'MANAGER'] 
    }
  }
];