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


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-user-dialog.html',
  styleUrl: './edit-user-dialog.css'
})
export class EditUserDialog {
  user: User;
  editUserForm: FormGroup;


  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.user = data.user;

    this.editUserForm = new FormGroup({
      id: new FormControl<number | null>(this.user.id),
      username: new FormControl(this.user.username, Validators.required),
      password: new FormControl(this.user.password, [Validators.required, Validators.minLength(6)]),
      first_name: new FormControl(this.user.first_name, Validators.required),
      last_name: new FormControl(this.user.last_name, Validators.required),
      birth_date: new FormControl<Date | null>(this.user.birth_date),
      phone: new FormControl<number | null>(this.user.phone, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      is_active: new FormControl<boolean | null>(this.user.is_active, Validators.required),
      role: new FormControl<Role | null>(null)
    });
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      this.userService.put(this.user.id, this.editUserForm.value).subscribe({
        next: (response) => {
          console.log('Formulario enviado con éxito:', response);
        },
        error: (error) => {
          console.log('El formulario no es válido.', error);
        }
      })
    }
  }
}
