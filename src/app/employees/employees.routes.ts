import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list';
import { EmployeeFormComponent } from './employee-form/employee-form';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
  },
  {
    path: 'crear',
    component: EmployeeFormComponent,
  },
  {
    path: 'editar/:id',
    component: EmployeeFormComponent,
  },
];