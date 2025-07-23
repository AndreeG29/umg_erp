import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
import { ProductFormComponent } from './product-form/product-form';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: 'crear',
    component: ProductFormComponent,
  },
  {
    path: 'editar/:id',
    component: ProductFormComponent,
  },
];
