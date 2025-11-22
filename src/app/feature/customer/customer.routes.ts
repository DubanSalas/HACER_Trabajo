import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer-list/customer-list').then(m => m.CustomerListComponent),
    data: { 
      title: 'Lista de Clientes',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./customer-form/customer-form').then(m => m.CustomerFormComponent),
    data: { 
      title: 'Nuevo Cliente',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./customer-form/customer-form').then(m => m.CustomerFormComponent),
    data: { 
      title: 'Editar Cliente',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
    }
  },
  // Ruta de detalle comentada hasta que se implemente el componente
  // {
  //   path: 'detail/:id',
  //   loadComponent: () =>
  //     import('./customer-detail/customer-detail').then(m => m.CustomerDetailComponent),
  //   data: { 
  //     title: 'Detalle del Cliente',
  //     roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] 
  //   }
  // }
];