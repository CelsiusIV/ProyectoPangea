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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatDate } from 'date-fns';
import { WarningDialog } from '../warning-dialog/warning-dialog';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatDatepickerModule, MatSlideToggleModule, MatCheckboxModule, MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-user-dialog.html',
  styleUrl: './edit-user-dialog.css'
})
export class EditUserDialog {
  //Variables
  user: User;
  editUserForm: FormGroup;
  roleNames: Role[] = [];
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorPass = false;
  errorMessage = "";
  errorPassMessage= "Mínimo 8 caracteres y 1 número";

  // Constructor
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, roleNames: Role[] } // Nos traemos el usuario y la lista de roles del padre
  ) {
    this.user = data.user;
    this.roleNames = data.roleNames;

    // Formulario de edición con sus validadores
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

  // Submit de edicion de usuario
  onSubmit() {
    if (this.editUserForm.valid) {
      const payload = { ...this.editUserForm.value };
      // Si no se define nueva contraseña no se envia, se deja como estaba
      if (!payload.password) {
        delete payload.password;
      }
      // Si se añade fecha de nacimiento, se formatea
      if (payload.birth_date) {
        payload.birth_date = formatDate(payload.birth_date, 'yyyy-MM-dd');
      }
      // Editamos el usuario
      this.userService.put(this.user.id, payload).subscribe({
        next: () => {
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error editar el usuario: ' + error.error.message } });
        }
      })
    } else {
      // Si los datos no son válidos se generan diferentes mensajes según el problema
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
