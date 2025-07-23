import { Routes } from '@angular/router';
import { Login } from './login/login.component';
import { LoginGuard } from './login.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login, canActivate: [LoginGuard] }
];
