import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userData = this.authService.getUserFromToken();
    
    if (!userData) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.getRoleName(userData.role);
    
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }

  private getRoleName(roleId: number): string {
    const roles: { [key: number]: string } = {
      1: 'Admin',
      2: 'Jefatura', 
      3: 'Asesor'
    };
    return roles[roleId] || 'Asesor';
  }
}