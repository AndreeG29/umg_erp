import { Routes } from '@angular/router';
<<<<<<< HEAD
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./clients/clients.routes').then((m) => m.CLIENT_ROUTES),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./employees/employees.routes').then((m) => m.EMPLOYEES_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.routes').then((m) => m.ROLE_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/sales.routes').then((m) => m.SALES_ROUTES),
      },
     /*
      */

    ],
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
=======

export const routes: Routes = [];
>>>>>>> ce3b7ce2b09e3242213faa51d663b12687146e40
