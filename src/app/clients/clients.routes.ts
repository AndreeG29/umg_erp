import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list';
import { ClientFormComponent } from './client-form/client-form';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientListComponent,
  },
  {
    path: 'crear',
    component: ClientFormComponent,
  },
  {
    path: 'editar/:id',
    component: ClientFormComponent,
  },
];