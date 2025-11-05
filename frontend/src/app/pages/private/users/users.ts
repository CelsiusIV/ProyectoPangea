import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-users',
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

}
