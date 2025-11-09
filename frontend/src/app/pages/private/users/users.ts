import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../service/user';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewuserBox } from '../../../component/newuser-box/newuser-box';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule,MatIcon],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
   readonly dialog = inject(MatDialog);
  openDialog(): void {
    this.dialog.open(NewuserBox);
  }

  users: any[] = []; // Variable para guardar el listado de usuarios
  loading = true; // Para mostrar un spinner mientras carga
  displayedColumns: string[] = ['id','username', 'first_name', 'birth_year', 'email', 'phone', 'is_active','borrar'];
  dataSource = this.users;
  constructor(private user: User) { }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList(): void {
    this.user.getUsers().subscribe({
      next: (response) => {
        // Asumiendo que Laravel devuelve: { status: true, data: [...] }
        if (response.status) {
          this.users = response.data;
        }
        this.dataSource = this.users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
        // Manejar errores (ej: mostrar un mensaje al usuario)
      }
    });
  }
}
