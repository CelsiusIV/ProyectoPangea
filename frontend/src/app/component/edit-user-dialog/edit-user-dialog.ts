import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../service/user-service';
import { Role, User } from '../../shared/models/user.interface';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker'; import { formatDate } from 'date-fns';
import { WarningDialog } from '../warning-dialog/warning-dialog';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatDatepickerModule, MatSlideToggleModule, MatCheckboxModule, MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-user-dialog.html',
  styleUrl: './edit-user-dialog.css'
})
export class EditUserDialog {
  user: User;
  editUserForm: FormGroup;
  roleNames: Role[] = [];
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorPass = false;
  errorMessage = "";
  errorPassMessage= "Mínimo 8 caracteres y 1 número";


  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, roleNames: Role[] }
  ) {
    this.user = data.user;
    this.roleNames = data.roleNames;

    this.editUserForm = new FormGroup({
      password: new FormControl('', [Validators.minLength(8), Validators.pattern('^(?=.*[0-9]).*$')]),
      first_name: new FormControl(this.user.first_name, Validators.required),
      last_name: new FormControl(this.user.last_name),
      birth_date: new FormControl<Date | null>(this.user.birth_date),
      phone: new FormControl<string | null>(this.user.phone, Validators.required),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
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
      if (payload.birth_date) {
        payload.birth_date = formatDate(payload.birth_date, 'yyyy-MM-dd');
      }
      this.userService.put(this.user.id, payload).subscribe({
        next: (response) => {
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error editar el usuario: ' + error.error.message } });
        }
      })
    } else {
      this.errorForm = true;

      const controls = this.editUserForm.controls;
      let hasRequiredError = false;
      let hasFormatError = false;

      for (const name in controls) {
        const errors = controls[name].errors;
        if (errors) {
          if (errors['required']) hasRequiredError = true;
          if (errors['pattern'] || errors['minlength'] || errors['email']) hasFormatError = true;
        }
      }

      // Definimos el mensaje estándar según lo encontrado
      if (hasRequiredError) {
        this.errorPass = false;
        this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      } else if (hasFormatError) {
        this.errorPass = true;
        this.errorMessage = "La contraseña o el email no tienen un formato válido.";
      } else {
        this.errorMessage = "Hay errores en el formulario. Por favor, revísalo.";
      }

    }
  }
}
