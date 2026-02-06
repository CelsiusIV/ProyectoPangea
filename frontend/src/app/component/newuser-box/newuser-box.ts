import { Component, Inject, inject, input, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../service/user-service';
import { Role } from '../../shared/models/user.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth-service';
import { WarningDialog } from '../warning-dialog/warning-dialog'
import { MatDatepickerModule } from '@angular/material/datepicker';import { formatDate } from 'date-fns';
;


@Component({
  selector: 'app-newuser-box',
  imports: [MatDatepickerModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './newuser-box.html',
  styleUrl: './newuser-box.css'
})
export class NewuserBox {
  readonly #formBuilder = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  roleNames: Role[] = [];
  newUserForm: FormGroup = this.#formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    first_name: ['', Validators.required],
    last_name: [''],
    birth_date: [''],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    role_id: [null as Role | null, Validators.required]
  })

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<NewuserBox>,
    public authService: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { roles: Role[] }
  ) {
    if (data && data.roles && data.roles.length > 0) {
      this.roleNames = data.roles;
    } else {
      this.roleNames = [];
      this.newUserForm.get('role_id')?.clearValidators();
      this.newUserForm.get('role_id')?.updateValueAndValidity();
    }
  }


  onSubmit() {
    if (this.newUserForm.valid) {
      const payload = { ...this.newUserForm.value };
      if (payload.birth_date) {
        payload.birth_date = formatDate(payload.birth_date, 'yyyy-MM-dd');
      }
      this.userService.post(payload).subscribe({
        next: () => {
          this.dialogRef.close({ created: true });
          console.log('Formulario enviado con éxito:', payload);
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al crear el usuario: ' + error.error.message } });
          console.log(error);
        }

      });
    };
  }
}