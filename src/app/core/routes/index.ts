// Exportar todas las rutas modulares para fácil importación
export { AUTH_ROUTES } from '../../feature/auth/auth.routes';
export { DASHBOARD_ROUTES } from '../../feature/dashboard/dashboard.routes';
export { CUSTOMER_ROUTES } from '../../feature/customer/customer.routes';
export { PRODUCTS_ROUTES } from '../../feature/products/products.routes';
export { SALES_ROUTES } from '../../feature/sales/sales.routes';
export { EMPLOYEES_ROUTES } from '../../feature/employees/employees.routes';
export { SUPPLIERS_ROUTES } from '../../feature/suppliers/suppliers.routes';
export { STORE_ROUTES } from '../../feature/store/store.routes';
// export { REPORTS_ROUTES } from '../../feature/reports/reports.routes';

// Tipos y interfaces para rutas
export interface RouteData {
  title?: string;
  roles?: string[];
  hideLayout?: boolean;
  breadcrumb?: string;
  icon?: string;
  description?: string;
}

// Configuración de rutas por módulo
export const ROUTE_CONFIG = {
  auth: {
    path: 'auth',
    title: 'Autenticación',
    icon: 'login',
    public: true
  },
  dashboard: {
    path: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  customers: {
    path: 'customers',
    title: 'Clientes',
    icon: 'people',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  products: {
    path: 'products',
    title: 'Productos',
    icon: 'inventory',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  sales: {
    path: 'sales',
    title: 'Ventas',
    icon: 'point_of_sale',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  employees: {
    path: 'employees',
    title: 'Empleados',
    icon: 'badge',
    roles: ['ADMIN', 'MANAGER']
  },
  suppliers: {
    path: 'suppliers',
    title: 'Proveedores',
    icon: 'business',
    roles: ['ADMIN', 'MANAGER']
  },
  store: {
    path: 'store',
    title: 'Almacén',
    icon: 'warehouse',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
  },
  reports: {
    path: 'reports',
    title: 'Reportes',
    icon: 'analytics',
    roles: ['ADMIN', 'MANAGER']
  }
} as const;