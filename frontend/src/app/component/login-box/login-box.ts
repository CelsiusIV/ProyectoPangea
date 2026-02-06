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
  readonly #formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  errorLogin: boolean = false;
  loginForm: FormGroup = this.#formBuilder.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]

  })

  constructor(private authService: AuthService, private router: Router, private dialogRef: MatDialogRef<LoginBox>
  ) { }
  navegarARegistro() {
    this.dialogRef.close();
    this.dialog.open(NewuserBox, {
      width: 'auto', // O el ancho que prefieras, ej: '400px'

      // ESTO ES CRÍTICO: Tu NewuserBox espera esto en el constructor
      data: {
        roles: [] // <--- Aquí deberías pasar los roles reales si quieres que el select funcione
      }
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/privado']);
        },
        error: (error) => {
          this.errorLogin = true;
        }

      })
    }
  }
}

