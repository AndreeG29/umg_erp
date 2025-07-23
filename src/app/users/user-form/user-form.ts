import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, User, Role } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  userId!: number;
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = +id;
        this.loadUser(this.userId);
      } else {
        this.isEditMode = false;
        this.userId = 0;
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role_id: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      email: '',
      password: '',
      role_id: ''
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  loadUser(id: number): void {
    this.userService.get(id).subscribe(user => {
      this.form.patchValue({
        name: user.name,
        email: user.email,
        role_id: user.role_id
      });
      this.form.get('password')?.setValidators([Validators.minLength(6)]);
      this.cdr.detectChanges();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = { ...this.form.value };
    
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    if (this.isEditMode) {
      this.userService.update(this.userId, formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/users']);
        });
      });
    } else {
      this.userService.create(formData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/users']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}