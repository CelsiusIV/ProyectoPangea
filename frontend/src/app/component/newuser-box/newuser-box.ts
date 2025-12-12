import { Component, Inject, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../service/user-service';
import { Role } from '../../shared/models/user.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-newuser-box',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './newuser-box.html',
  styleUrl: './newuser-box.css'
})
export class NewuserBox {
  readonly #formBuilder = inject(FormBuilder);
  roleNames: Role[] = [];
  newUserForm: FormGroup = this.#formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    first_name: ['', Validators.required],
    last_name: [''],
    birth_date: [''],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    role: [null as Role | null, Validators.required]
  })

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { roles: Role[] }
  ) {
    this.roleNames = data.roles;
  }


  onSubmit() {
    if (this.newUserForm.valid) {
      this.userService.post(this.newUserForm.value).subscribe({
        next: (response) => {

          console.log('Formulario enviado con éxito:', this.newUserForm.value);
        },
        error: (error) => {
          console.log('El formulario no es válido.', error);
        }

      });
    };
  }
}