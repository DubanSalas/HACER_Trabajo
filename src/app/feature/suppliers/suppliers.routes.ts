import { Routes } from '@angular/router';

export const SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./suppliers-list/suppliers-list').then(m => m.SuppliersListComponent),
    data: { 
      title: 'Lista de Proveedores',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./supplier-form/supplier-form').then(m => m.SupplierFormComponent),
    data: { 
      title: 'Nuevo Proveedor',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./supplier-form/supplier-form').then(m => m.SupplierFormComponent),
    data: { 
      title: 'Editar Proveedor',
      roles: ['ADMIN', 'MANAGER'] 
    }
  }
];