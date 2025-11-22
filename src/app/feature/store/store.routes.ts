import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./store-list/store-list').then(m => m.StoreListComponent),
    data: { 
      title: 'Inventario de Almacén',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./store-form/store-form').then(m => m.StoreFormComponent),
    data: { 
      title: 'Nuevo Item de Inventario',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./store-form/store-form').then(m => m.StoreFormComponent),
    data: { 
      title: 'Editar Item de Inventario',
      roles: ['ADMIN', 'MANAGER'] 
    }
  }
];