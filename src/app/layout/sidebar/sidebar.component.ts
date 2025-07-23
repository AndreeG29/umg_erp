import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  menuItems = [
    { route: '/dashboard', icon: '📊', label: 'Dashboard' },
    { route: '/employees', icon: '👥', label: 'Empleados' },
    { route: '/products', icon: '📦', label: 'Productos' },
    { route: '/clients', icon: '🧑‍💼', label: 'Clientes' },
    { route: '/roles', icon: '🔐', label: 'Roles' },
    { route: '/users', icon: '👤', label: 'Usuarios' },
    { route: '/sales', icon: '💰', label: 'Ventas' }
  ];

  visibleMenus: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserPermissions().subscribe({
      next: (permissions) => {
        this.visibleMenus = this.menuItems.filter(item => 
          permissions.some(p => p.route === item.route && p.can_view)
        );
      },
      error: (error) => {
        console.error('Error cargando permisos:', error);
        this.visibleMenus = [this.menuItems[0]];
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
