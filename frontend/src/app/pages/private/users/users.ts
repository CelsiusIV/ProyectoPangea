import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user';
import { MatDialog } from '@angular/material/dialog';
import { NewuserBox } from '../../../component/newuser-box/newuser-box';
import { User } from '../../../shared/models/user.interface';
import { UserTable } from "../../../component/user-table/user-table";


@Component({
  selector: 'app-users',
  imports: [CommonModule, UserTable],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
   readonly dialog = inject(MatDialog);
  openDialog(): void {
    this.dialog.open(NewuserBox);
  }

  users: User[] = []; 
  loading = true; 

  dataSource = this.users;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.status) {
          this.users = response.data;
        }
        this.dataSource = this.users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
      }
    });
  }
}
