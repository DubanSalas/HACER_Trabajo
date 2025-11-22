import { Routes } from '@angular/router';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./employees-list/employees-list').then(m => m.EmployeesListComponent),
    data: { 
      title: 'Lista de Empleados',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./employees-form/employees-form').then(m => m.EmployeesFormComponent),
    data: { 
      title: 'Nuevo Empleado',
      roles: ['ADMIN', 'MANAGER'] 
    }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./employees-form/employees-form').then(m => m.EmployeesFormComponent),
    data: { 
      title: 'Editar Empleado',
      roles: ['ADMIN', 'MANAGER'] 
    }
  }
];