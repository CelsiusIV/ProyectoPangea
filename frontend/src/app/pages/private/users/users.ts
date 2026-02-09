import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { NewuserBox } from '../../../component/newuser-box/newuser-box';
import { Role, User } from '../../../shared/models/user.interface';
import { UserTable } from "../../../component/user-table/user-table";
import { RoleService } from '../../../service/role-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../service/auth-service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatSelectModule, UserTable, MatFormFieldModule, MatInputModule, MatIcon, MatIconButton],
  templateUrl: './users.html',
  styleUrl: './users.css'
})

export class Users implements OnInit {
  readonly dialog = inject(MatDialog);
  roleNames: Role[] = [];
  loading = true;
  users = new MatTableDataSource<User>();

  newUser(): void {
    const dialogNew = this.dialog.open(NewuserBox, { data: { roles: this.roleNames } });
    dialogNew.afterClosed().subscribe(result => {
      if (result?.created) {
        this.getUsersList();
      }
    })
  }



  constructor(private userService: UserService, private roleService: RoleService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsersList();
    this.roleService.getRoles().subscribe({
      next: (response) => {
        if (this.authService.currentUser()?.role?.role_name ===
          'profesor') {
          this.roleNames = response.data.filter((r: any) => r.role_name != "admin");
        } else {
          this.roleNames = response.data;
        }
      },
      error: () => {
      }
    })

  }

  getUsersList(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.data = [...response.data];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

}
