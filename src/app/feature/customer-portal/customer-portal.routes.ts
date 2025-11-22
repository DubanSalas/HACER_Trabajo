import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from '../../layout/customer-layout/customer-layout';

export const customerPortalRoutes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./customer-home/customer-home').then(m => m.CustomerHomeComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./customer-menu/customer-menu').then(m => m.CustomerMenuComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./customer-cart/customer-cart').then(m => m.CustomerCartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./customer-checkout/customer-checkout').then(m => m.CustomerCheckoutComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./customer-orders/customer-orders').then(m => m.CustomerOrdersComponent)
      },
      {
        path: 'order/:id',
        loadComponent: () => import('./order-detail/order-detail').then(m => m.OrderDetailComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./customer-profile/customer-profile').then(m => m.CustomerProfileComponent)
      },
      {
        path: 'order-confirmation',
        loadComponent: () => import('./order-confirmation/order-confirmation').then(m => m.OrderConfirmationComponent)
      },
      {
        path: 'api-test',
        loadComponent: () => import('./api-test/api-test').then(m => m.ApiTestComponent)
      }
    ]
  }
];