import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list';
import { UserFormComponent } from './user-form/user-form';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: 'crear',
    component: UserFormComponent,
  },
  {
    path: 'editar/:id',
    component: UserFormComponent,
  },
];