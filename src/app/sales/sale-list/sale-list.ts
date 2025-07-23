import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SaleService, Sale } from '../sale.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sale-list.html',
  styleUrls: ['./sale-list.scss'],
})
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];

  constructor(
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.saleService.getAll().subscribe({
      next: (data) => (this.sales = data),
      error: (err) => console.error('Error cargando ventas', err),
    });
  }

  editSale(id: number): void {
    this.router.navigate(['/sales/editar', id]);
  }

  viewDetails(id: number): void {
    this.saleService.getSaleItems(id).subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          let itemsHtml = '<div style="text-align: left;">';
          items.forEach(item => {
            const subtotal = item.quantity * (+item.price);
            itemsHtml += `
              <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <strong>${item.product_name || 'Producto ID: ' + item.product_id}</strong><br>
                Cantidad: ${item.quantity}<br>
                Precio: Q${(+item.price).toFixed(2)}<br>
                Subtotal: Q${subtotal.toFixed(2)}
              </div>
            `;
          });
          itemsHtml += '</div>';

          Swal.fire({
            title: `Detalles de Venta #${id}`,
            html: itemsHtml,
            width: 600,
            confirmButtonText: 'Cerrar'
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin detalles',
            text: 'Esta venta no tiene productos asociados',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error) => {
        console.error('Error obteniendo items:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los detalles de la venta',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  deleteSale(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Venta eliminada',
            text: 'La venta se eliminó correctamente ✅',
            confirmButtonText: 'OK'
          }).then(() => {
            this.ngOnInit();
          });
        });
      }
    });
  }
}