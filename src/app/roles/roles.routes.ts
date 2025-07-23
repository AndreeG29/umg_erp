import { Routes } from '@angular/router';
import { RoleListComponent } from './role-list/role-list';
import { RoleFormComponent } from './role-form/role-form';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    component: RoleListComponent,
  },
  {
    path: 'crear',
    component: RoleFormComponent,
  },
  {
    path: 'editar/:id',
    component: RoleFormComponent,
  },
];