import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SaleService, Sale, Client, User, Product } from '../sale.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-sale-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sale-form.html',
  styleUrls: ['./sale-form.scss'],
})
export class SaleFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  saleId!: number;
  clients: Client[] = [];
  users: User[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private saleService: SaleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.saleId = +id;
        this.loadSale(this.saleId);
      } else {
        this.isEditMode = false;
        this.saleId = 0;
        this.addItem();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      client_id: ['', Validators.required],
      user_id: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  loadData(): void {
    this.saleService.getClients().subscribe(clients => {
      console.log('Clientes cargados:', clients);
      this.clients = clients;
    });
    this.saleService.getUsers().subscribe(users => {
      console.log('Usuarios cargados:', users);
      this.users = users;
    });
    this.saleService.getProducts().subscribe({
      next: (products) => {
        console.log('Productos cargados:', products);
        this.products = products;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  get itemsFormArray() {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemForm = this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
    this.itemsFormArray.push(itemForm);
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  updatePrice(index: number): void {
    const item = this.itemsFormArray.at(index);
    const productId = item.get('product_id')?.value;
    const product = this.products.find(p => p.id == productId);
    if (product) {
      item.patchValue({ price: product.price });
    }
  }

  getMaxStock(index: number): number {
    const item = this.itemsFormArray.at(index);
    const productId = item.get('product_id')?.value;
    const product = this.products.find(p => p.id == productId);
    return product ? product.stock : 0;
  }

  calculateTotal(): number {
    return this.itemsFormArray.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + (quantity * price);
    }, 0);
  }

  validateStock(): boolean {
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const item = this.itemsFormArray.at(i);
      const productId = item.get('product_id')?.value;
      const quantity = item.get('quantity')?.value;
      
      const product = this.products.find(p => p.id == productId);
      if (product && quantity > product.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: `${product.name} solo tiene ${product.stock} unidades disponibles`
        });
        return false;
      }
    }
    return true;
  }

  loadSale(id: number): void {
    this.saleService.get(id).subscribe(sale => {
      this.form.patchValue({
        client_id: sale.client_id,
        user_id: sale.user_id
      });

      while (this.itemsFormArray.length !== 0) {
        this.itemsFormArray.removeAt(0);
      }

      sale.items.forEach(item => {
        const itemForm = this.fb.group({
          product_id: [item.product_id, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]]
        });
        this.itemsFormArray.push(itemForm);
      });

      this.cdr.detectChanges();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.validateStock()) return;

    const formValue = this.form.value;
    const saleData = {
      client_id: formValue.client_id,
      user_id: formValue.user_id,
      total: this.calculateTotal(),
      items: formValue.items
    };

    if (this.isEditMode) {
      this.saleService.update(this.saleId, saleData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Venta actualizada',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/sales']);
        });
      });
    } else {
      this.saleService.create(saleData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Venta creada',
          text: 'La venta se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/sales']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isItemInvalid(index: number, controlName: string): boolean {
    const item = this.itemsFormArray.at(index);
    const control = item.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}