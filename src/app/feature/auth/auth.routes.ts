import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'user-type',
    pathMatch: 'full'
  },
  {
    path: 'user-type',
    loadComponent: () =>
      import('./user-type-selection/user-type-selection').then(m => m.UserTypeSelectionComponent),
    data: { 
      title: 'Seleccionar Tipo de Usuario',
      hideLayout: true 
    }
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.LoginComponent),
    data: { 
      title: 'Iniciar Sesión - Administrador',
      hideLayout: true 
    }
  },
  {
    path: 'customer-login',
    loadComponent: () =>
      import('./customer-login/customer-login').then(m => m.CustomerLoginComponent),
    data: { 
      title: 'Iniciar Sesión - Cliente',
      hideLayout: true 
    }
  },
  {
    path: 'customer-register',
    loadComponent: () =>
      import('./customer-register/customer-register').then(m => m.CustomerRegisterComponent),
    data: { 
      title: 'Registro - Cliente',
      hideLayout: true 
    }
  }
];