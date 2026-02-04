import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../service/auth-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'loginBox',
  imports: [MatTooltipModule,ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './login-box.html',
  styleUrl: './login-box.css'
})
export class LoginBox {
  readonly #formBuilder = inject(FormBuilder);
  errorLogin: boolean = false;
  loginForm: FormGroup = this.#formBuilder.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]

  })

  constructor(private authService: AuthService, private router: Router, private dialogRef: MatDialogRef<LoginBox>
) { }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/privado']);
        },
        error: (error) => {
          this.errorLogin=true;
          console.log('No se ha podido realizar el login', error);
        }

      })
    }
  }
}
