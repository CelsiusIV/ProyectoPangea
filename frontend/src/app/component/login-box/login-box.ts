import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewuserBox } from '../newuser-box/newuser-box';



@Component({
  selector: 'loginBox',
  imports: [MatTooltipModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './login-box.html',
  styleUrl: './login-box.css'
})
export class LoginBox {
  // Variables
  readonly #formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  errorLogin: boolean = false;

  // Formulario de login con validaciones
  loginForm: FormGroup = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]

  })

  // Constructor
  constructor(private authService: AuthService, private router: Router, private dialogRef: MatDialogRef<LoginBox>
  ) { }

  // Abre el dialog de nuevo usuario para el registro
  navegarARegistro() {
    this.dialogRef.close();
    this.dialog.open(NewuserBox);
  }

  // Submit de Login
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/privado']);
        },
        error: () => {
          this.errorLogin = true;
        }

      })
    } else {
      this.errorLogin = true;
    }
  }
}

