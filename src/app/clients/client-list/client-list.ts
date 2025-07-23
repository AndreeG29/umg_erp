import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService, Client } from '../client.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.scss'],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getAll().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Error cargando clientes', err),
    });
  }

  editClient(id: number): void {
    this.router.navigate(['/clients/editar', id]);
  }

  deleteClient(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado',
            text: 'El cliente se eliminó correctamente ✅',
            confirmButtonText: 'OK'
          }).then(() => {
            this.ngOnInit();
          });
        });
      }
    });
  }
}