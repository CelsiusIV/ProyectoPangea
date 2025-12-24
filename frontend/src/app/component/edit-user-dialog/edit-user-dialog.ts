import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { UserService } from '../../service/user-service';
import { Role, User } from '../../shared/models/user.interface';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatCheckboxModule, MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-user-dialog.html',
  styleUrl: './edit-user-dialog.css'
})
export class EditUserDialog {
  user: User;
  editUserForm: FormGroup;
  roleNames: Role[] = [];


  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, roleNames: Role[] }
  ) {
    this.user = data.user;
    this.roleNames = data.roleNames;

    this.editUserForm = new FormGroup({
      password: new FormControl(''),
      first_name: new FormControl(this.user.first_name, Validators.required),
      last_name: new FormControl(this.user.last_name),
      birth_date: new FormControl<Date | null>(this.user.birth_date),
      phone: new FormControl<string | null>(this.user.phone, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      is_active: new FormControl<boolean>(this.user.is_active),
      role_id: new FormControl<number>(this.user.role.id, Validators.required)
    });
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      const payload = { ...this.editUserForm.value };
      if (!payload.password) {
        delete payload.password;
      }
      this.userService.put(this.user.id,payload).subscribe({
        next: (response) => {
          console.log('Formulario enviado con éxito:', response);
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          console.log(this.editUserForm.value);
          console.log('El formulario no es válido.', error);
        }
      })
    } else {
      Object.entries(this.editUserForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.warn(`Control inválido: ${key}`, control.errors, control.value);
        }
      });
    }
  }
}
