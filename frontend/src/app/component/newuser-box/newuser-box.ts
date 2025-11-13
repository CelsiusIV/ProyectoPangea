import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newuser-box',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './newuser-box.html',
  styleUrl: './newuser-box.css'
})
export class NewuserBox {
  newUserForm = new FormGroup({
    username: new FormControl('', Validators.required), 
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', Validators.required),
    lastname: new FormControl(''),
    birthyear: new FormControl(''),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('')
  });

  onSubmit() {
    if (this.newUserForm.valid) {
      console.log('Formulario enviado con éxito:', this.newUserForm.value);
    } else {
      console.log('El formulario no es válido.');
    }
  }
}