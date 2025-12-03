import { Component, inject, input, Input, OnInit, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Role, User } from '../../shared/models/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialog } from '../edit-user-dialog/edit-user-dialog';
import { UserService } from '../../service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIcon, CommonModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTable implements OnInit{

  refresh = output<void>();
  users = input.required<User[]>();
  displayedColumns: string[] = ['username', 'first_name', 'last_name', 'email', 'phone', 'role', 'actions'];

  ngOnInit(){
    console.log(this.users);
  }

  readonly dialog = inject(MatDialog)
  editUser(user: User) {
    this.dialog.open(EditUserDialog, { data: { user } });
    this.refresh.emit();
  }

  constructor(private userService: UserService) { }
  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: (response) => {
          console.log(`Usuario con ID ${id} eliminado correctamente.`, response);
          this.refresh.emit();
        },
        error: (error) => {
          console.error(`Error al eliminar usuario con ID ${id}:`, error);
        }
      });
    }

  }
}
