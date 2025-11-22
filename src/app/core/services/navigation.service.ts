import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ROUTE_CONFIG, RouteData } from '../routes';

export interface NavigationItem {
  path: string;
  title: string;
  icon: string;
  roles?: string[];
  children?: NavigationItem[];
  badge?: string;
  disabled?: boolean;
}

export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentRouteSubject = new BehaviorSubject<RouteData | null>(null);
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);

  currentRoute$ = this.currentRouteSubject.asObservable();
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  // Configuración de navegación principal
  private navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
    },
    {
      path: '/customers',
      title: 'Clientes',
      icon: 'people',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        { path: '/customers', title: 'Lista de Clientes', icon: 'list' },
        { path: '/customers/create', title: 'Nuevo Cliente', icon: 'person_add' }
      ]
    },
    {
      path: '/products',
      title: 'Productos',
      icon: 'inventory',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        { path: '/products', title: 'Lista de Productos', icon: 'list' },
        { path: '/products/create', title: 'Nuevo Producto', icon: 'add_box' }
      ]
    },
    {
      path: '/sales',
      title: 'Ventas',
      icon: 'point_of_sale',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        { path: '/sales', title: 'Lista de Ventas', icon: 'list' },
        { path: '/sales/new', title: 'Nueva Venta', icon: 'add_shopping_cart' }
      ]
    },
    {
      path: '/employees',
      title: 'Empleados',
      icon: 'badge',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { path: '/employees', title: 'Lista de Empleados', icon: 'list' },
        { path: '/employees/create', title: 'Nuevo Empleado', icon: 'person_add' }
      ]
    },
    {
      path: '/suppliers',
      title: 'Proveedores',
      icon: 'business',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { path: '/suppliers', title: 'Lista de Proveedores', icon: 'list' },
        { path: '/suppliers/create', title: 'Nuevo Proveedor', icon: 'business_center' }
      ]
    },
    {
      path: '/store',
      title: 'Almacén',
      icon: 'warehouse',
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
      children: [
        { path: '/store', title: 'Inventario', icon: 'inventory_2' },
        { path: '/store/movements', title: 'Movimientos', icon: 'swap_horiz' },
        { path: '/store/alerts', title: 'Alertas', icon: 'warning' }
      ]
    },
    {
      path: '/reports',
      title: 'Reportes',
      icon: 'analytics',
      roles: ['ADMIN', 'MANAGER'],
      children: [
        { path: '/reports/sales', title: 'Reportes de Ventas', icon: 'trending_up' },
        { path: '/reports/inventory', title: 'Reportes de Inventario', icon: 'inventory' },
        { path: '/reports/customers', title: 'Reportes de Clientes', icon: 'people' },
        { path: '/reports/financial', title: 'Reportes Financieros', icon: 'account_balance' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initializeRouteTracking();
  }

  private initializeRouteTracking(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute)
      )
      .subscribe(() => {
        this.updateCurrentRoute();
        this.updateBreadcrumbs();
      });
  }

  private updateCurrentRoute(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    
    const routeData = route.snapshot.data as RouteData;
    this.currentRouteSubject.next(routeData);
  }

  private updateBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    let route = this.activatedRoute.root;
    let url = '';

    while (route) {
      if (route.snapshot.data['title']) {
        url += '/' + route.snapshot.url.map(segment => segment.path).join('/');
        breadcrumbs.push({
          label: route.snapshot.data['title'],
          url: url,
          icon: route.snapshot.data['icon']
        });
      }
      route = route.firstChild!;
    }

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  getNavigationItems(): NavigationItem[] {
    return this.navigationItems;
  }

  getFilteredNavigationItems(userRoles: string[]): NavigationItem[] {
    return this.navigationItems.filter(item => 
      !item.roles || item.roles.some(role => userRoles.includes(role))
    );
  }

  navigateTo(path: string, params?: any): void {
    if (params) {
      this.router.navigate([path], { queryParams: params });
    } else {
      this.router.navigate([path]);
    }
  }

  navigateToWithState(path: string, state: any): void {
    this.router.navigate([path], { state });
  }

  goBack(): void {
    window.history.back();
  }

  getCurrentRoute(): RouteData | null {
    return this.currentRouteSubject.value;
  }

  getCurrentBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.value;
  }

  isCurrentRoute(path: string): boolean {
    return this.router.url === path;
  }

  isRouteActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}