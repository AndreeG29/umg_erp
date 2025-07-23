import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService, Role } from '../role.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-role-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './role-form.html',
  styleUrls: ['./role-form.scss'],
})
export class RoleFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  roleId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.roleId = +id;
        this.loadRole(this.roleId);
      } else {
        this.isEditMode = false;
        this.roleId = 0;
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: ''
    });
  }

  loadRole(id: number): void {
    this.roleService.get(id).subscribe(role => {
      this.form.patchValue({
        name: role.name
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
      this.roleService.update(this.roleId, this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Rol actualizado',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/roles']);
        });
      });
    } else {
      this.roleService.create(this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Rol creado',
          text: 'El rol se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/roles']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}