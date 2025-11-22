import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas de autenticación (públicas)
  {
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Portal del Cliente (público/protegido)
  {
    path: 'customer',
    loadChildren: () => import('./feature/customer-portal/customer-portal.routes').then(m => m.customerPortalRoutes)
  },
  
  // Ruta de login directa - redirige a selección de tipo de usuario
  {
    path: 'login',
    redirectTo: '/auth/user-type',
    pathMatch: 'full'
  },

  // Rutas de testing (desarrollo)
  // {
  //   path: 'test',
  //   loadComponent: () =>
  //     import('./test/test.component').then(m => m.TestComponent)
  // },
  {
    path: 'customers-test',
    loadComponent: () =>
      import('./feature/customer/customer-list/customer-list').then(m => m.CustomerListComponent)
  },
  {
    path: 'dashboard-test',
    loadComponent: () =>
      import('./feature/dashboard/dashboard/dashboard').then(m => m.DashboardComponent)
  },

  // Ruta raíz redirige a la selección de tipo de usuario
  {
    path: '',
    redirectTo: '/auth/user-type',
    pathMatch: 'full'
  },

  // Rutas protegidas con AdminLayout
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./feature/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },

      // Gestión de Clientes
      {
        path: 'customers',
        loadChildren: () => import('./feature/customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
      },

      // Gestión de Productos
      {
        path: 'products',
        loadChildren: () => import('./feature/products/products.routes').then(m => m.PRODUCTS_ROUTES)
      },

      // Gestión de Ventas
      {
        path: 'sales',
        loadChildren: () => import('./feature/sales/sales.routes').then(m => m.SALES_ROUTES)
      },

      // Gestión de Empleados
      {
        path: 'employees',
        loadChildren: () => import('./feature/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },

      // Gestión de Proveedores
      {
        path: 'suppliers',
        loadChildren: () => import('./feature/suppliers/suppliers.routes').then(m => m.SUPPLIERS_ROUTES)
      },

      // Gestión de Inventario/Almacén
      {
        path: 'store',
        loadChildren: () => import('./feature/store/store.routes').then(m => m.STORE_ROUTES)
      },

      // Reportes
      // {
      //   path: 'reports',
      //   loadChildren: () => import('./feature/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      // }
    ]
  },

  // Ruta wildcard - redirige a la selección de usuario si no encuentra la ruta
  {
    path: '**',
    redirectTo: '/auth/user-type'
  }
];