import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-user-table',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIcon],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTable {

  @Input() dataSource: User[] = [];
  displayedColumns: string[] = ['username', 'first_name', 'last_name', 'birth_year', 'email', 'phone', 'is_active', 'borrar'];

}
