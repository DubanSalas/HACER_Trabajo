import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sales-list/sales-list').then(m => m.SalesListComponent),
    data: { 
      title: 'Lista de Ventas',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./sales-form/sales-form').then(m => m.SalesFormComponent),
    data: { 
      title: 'Nueva Venta',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./sales-form/sales-form').then(m => m.SalesFormComponent),
    data: { 
      title: 'Editar Venta',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./sales-detail/sales-detail').then(m => m.SalesDetailComponent),
    data: { 
      title: 'Detalle de Venta',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'receipt/:id',
    loadComponent: () => import('./sales-receipt/sales-receipt').then(m => m.SalesReceiptComponent),
    data: { 
      title: 'Boleta de Venta',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: ':id',
    redirectTo: 'detail/:id',
    pathMatch: 'full'
  }
];