import { Component, inject, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Role, User } from '../../shared/models/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialog } from '../edit-user-dialog/edit-user-dialog';
import { UserService } from '../../service/user-service';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog';
import { WarningDialog } from '../warning-dialog/warning-dialog';

@Component({
  selector: 'app-user-table',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIcon, CommonModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTable {
  // Variables
  refresh = output<void>();
  users = input.required<MatTableDataSource<User>>();
  roleNames = input.required<Role[]>();
  displayedColumns: string[] = ['first_name', 'last_name', 'role', 'actions'];
  readonly dialog = inject(MatDialog)

  // Funcion de editar usuario, que llama al objeto EditUserDialog y le envia los datos
  editUser(user: User) {
    const dialogEdit = this.dialog.open(EditUserDialog, { data: { user, roleNames: this.roleNames() } });
    dialogEdit.afterClosed().subscribe(result => {
      if (result?.created) {
        this.refresh.emit();
      }
    })

  }

  // Constructor
  constructor(private userService: UserService) { }

  // Funcion de borrar usuario
  deleteUser(id: number) {
    const dialogDEL = this.dialog.open(DeleteConfirmationDialog, { data: { message: '¿Estas seguro de querer borrar este usuario?' } });

    dialogDEL.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.refresh.emit();
          },
          error: (error) => {
            this.dialog.open(WarningDialog, { data: { message: 'Error al borrar el usuario: ' + error.error.message } });
          }
        });
      }
    });

  }
}
