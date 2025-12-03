import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { NewuserBox } from '../../../component/newuser-box/newuser-box';
import { Role, User } from '../../../shared/models/user.interface';
import { UserTable } from "../../../component/user-table/user-table";
import { RoleService } from '../../../service/role-service';


@Component({
  selector: 'app-users',
  imports: [CommonModule, UserTable],
  templateUrl: './users.html',
  styleUrl: './users.css'
})

export class Users implements OnInit {
  readonly dialog = inject(MatDialog);
  roleNames: Role[] = [];

  newUser(): void {
    this.dialog.open(NewuserBox, { data: { roles: this.roleNames } });
  }

  users: User[] = [];
  loading = true;

  constructor(private userService: UserService, private roleService: RoleService) { }

  ngOnInit(): void {
    this.getUsersList();
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roleNames = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  getUsersList(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
      }
    });
  }
}
