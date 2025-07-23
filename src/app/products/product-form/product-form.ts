import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../product.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID recibido de la ruta:', id);
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        console.log('ProductId convertido:', this.productId);
        this.loadProduct(this.productId);
      } else {
        this.isEditMode = false;
        this.productId = 0;
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: ''
    });
  }


  loadProduct(id: number): void {
    console.log('Cargando producto con ID:', id);
    this.productService.get(id).subscribe(product => {
      console.log('Producto recibido:', product);
      this.form.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category
      });
      this.cdr.detectChanges();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.productService.update(this.productId, this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/products']);
        });
      });
    } else {
      this.productService.create(this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/products']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
