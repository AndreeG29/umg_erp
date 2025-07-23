import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from '../client.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-form.html',
  styleUrls: ['./client-form.scss'],
})
export class ClientFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  clientId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.clientId = +id;
        this.loadClient(this.clientId);
      } else {
        this.isEditMode = false;
        this.clientId = 0;
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      enterprise: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      enterprise: ''
    });
  }

  loadClient(id: number): void {
    this.clientService.get(id).subscribe(client => {
      this.form.patchValue({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        enterprise: client.enterprise
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
      this.clientService.update(this.clientId, this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/clients']);
        });
      });
    } else {
      this.clientService.create(this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente creado',
          text: 'El cliente se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/clients']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}