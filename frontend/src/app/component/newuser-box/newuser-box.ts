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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatDate } from 'date-fns';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-newuser-box',
  imports: [MatTooltipModule, MatDatepickerModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './newuser-box.html',
  styleUrl: './newuser-box.css'
})
export class NewuserBox {

  // Variablñes
  readonly #formBuilder = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  roleNames: Role[] = [];
  errorForm = false;
  errorPass = false;
  errorMessage = "";
  errorPassMessage = "Mínimo 8 caracteres y 1 número";

  // Formulario de nuevo usuario con sus validaciones
  newUserForm: FormGroup = this.#formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9]).*$')]],
    first_name: ['', Validators.required],
    last_name: [''],
    birth_date: [''],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role_id: [4, Validators.required]
  })

  // Constructor
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<NewuserBox>,
    public authService: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { roles: Role[] } // Nos traemos los roles del padre
  ) {
    // Comprobacion para saber si trae roles o no y mostrarlos en consecuencia.
    if (data && data.roles && data.roles.length > 0) {
      this.roleNames = data.roles;
    } else {
      this.roleNames = [];
      this.newUserForm.get('role_id')?.clearValidators();
      this.newUserForm.get('role_id')?.updateValueAndValidity();
    }
  }


  // Submit de Añadir usuario
  onSubmit() {
    // Validamos formulario
    if (this.newUserForm.valid) {
      const payload = { ...this.newUserForm.value };
      // Formateamos fecha de nacimiento
      if (payload.birth_date) {
        payload.birth_date = formatDate(payload.birth_date, 'yyyy-MM-dd');
      }
      // Creamos el usuario
      this.userService.post(payload).subscribe({
        next: () => {
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al crear el usuario: ' + error.error.message } });
        }

      });
    } else {
      // Si los datos no son válidos se generan diferentes mensajes según el problema
      this.errorForm = true;
      const controls = this.newUserForm.controls;
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
    };
  }
}