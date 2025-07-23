import { Routes } from '@angular/router';
import { SaleListComponent } from './sale-list/sale-list';
import { SaleFormComponent } from './sale-form/sale-form';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    component: SaleListComponent,
  },
  {
    path: 'crear',
    component: SaleFormComponent,
  },
  {
    path: 'editar/:id',
    component: SaleFormComponent,
  },
];