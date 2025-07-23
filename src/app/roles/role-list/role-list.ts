import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService, Role } from '../role.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './role-list.html',
  styleUrls: ['./role-list.scss'],
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleService.getAll().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error cargando roles', err),
    });
  }

  editRole(id: number): void {
    this.router.navigate(['/roles/editar', id]);
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Rol eliminado',
            text: 'El rol se eliminó correctamente ✅',
            confirmButtonText: 'OK'
          }).then(() => {
            this.ngOnInit();
          });
        });
      }
    });
  }
}