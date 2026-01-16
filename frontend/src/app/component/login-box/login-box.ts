import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'loginBox',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './login-box.html',
  styleUrl: './login-box.css'
})
export class LoginBox {
  readonly #formBuilder = inject(FormBuilder);
  loginForm: FormGroup = this.#formBuilder.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]

  })

  constructor(private authService: AuthService) { }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Login realizado', this.loginForm.value);
        },
        error: (error) => {
          console.log('No se ha podido realizar el login', error);
        }

      })
    }
  }
}
