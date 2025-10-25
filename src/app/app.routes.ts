import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './feature/dashboard/dashboard/dashboard';

// Resolver para diferentes componentes
import { SuppliersResolver } from './core/resolvers/suppliers.resolver';
import { ProductsResolver } from './core/resolvers/products.resolver';
import { SalesResolver } from './core/resolvers/sales.resolver';
import { InventoryResolver } from './core/resolvers/inventory.resolver';

// Guard para proteger las rutas
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./shared/components/connection-test/connection-test.component').then((m) => m.ConnectionTestComponent),
  },
  {
    path: 'simple-test',
    loadComponent: () =>
      import('./shared/components/simple-test/simple-test.component').then((m) => m.SimpleTestComponent),
  },
  {
    path: 'login-test',
    loadComponent: () =>
      import('./shared/components/login-test/login-test.component').then((m) => m.LoginTestComponent),
  },
  {
    path: 'bypass-login',
    loadComponent: () =>
      import('./shared/components/bypass-login/bypass-login.component').then((m) => m.BypassLoginComponent),
  },
  {
    path: 'data-demo',
    loadComponent: () =>
      import('./shared/components/data-demo/data-demo.component').then((m) => m.DataDemoComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],  // Solo acceso si está autenticado
    children: [
      {
        path: 'dashboard',
        component: Dashboard,  // Dashboard que está protegido por el guard
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./feature/suppliers/suppliers-list/suppliers-list').then((m) => m.SuppliersList),
        resolve: { suppliers: SuppliersResolver },  // Resolver para Suppliers
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./feature/employees/employees-list/employees-list').then((m) => m.EmployeesList),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./feature/customer/customer-list/customer-list').then((m) => m.CustomerListComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./feature/products/products-list/products-list').then((m) => m.ProductsList),
        resolve: { products: ProductsResolver },  // Resolver para Products
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./feature/sales/sales-list/sales-list').then((m) => m.SalesListComponent),
        resolve: { sales: SalesResolver },  // Resolver para Sales
      },
      {
        path: 'store',
        loadComponent: () =>
          import('./feature/store/store-list/store-list').then((m) => m.StoreListComponent),
      },
      {
        path: 'test-connection',
        loadComponent: () =>
          import('./shared/components/connection-test/connection-test.component').then((m) => m.ConnectionTestComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard', // Redirige a dashboard por defecto
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login', // Si la ruta no existe, redirige a login
  },
];
