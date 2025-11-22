import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'simple',
    loadComponent: () => import('./simple-dashboard/simple-dashboard').then(m => m.SimpleDashboardComponent)
  }
];