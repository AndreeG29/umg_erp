import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee, User } from '../employee.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  employeeId!: number;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.employeeId = +id;
        this.loadEmployee(this.employeeId);
      } else {
        this.isEditMode = false;
        this.employeeId = 0;
        this.resetForm();
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      user_id: ['', Validators.required],
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      user_id: ''
    });
  }

  loadUsers(): void {
    this.employeeService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.get(id).subscribe(employee => {
      this.form.patchValue({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        user_id: employee.user_id
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
      this.employeeService.update(this.employeeId, this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Empleado actualizado',
          text: 'Los cambios se guardaron correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/employees']);
        });
      });
    } else {
      this.employeeService.create(this.form.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Empleado creado',
          text: 'El empleado se creó correctamente ✅',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/employees']);
        });
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}