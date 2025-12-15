import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'loginBox',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './login-box.html',
  styleUrl: './login-box.css'
})
export class LoginBox {

}
