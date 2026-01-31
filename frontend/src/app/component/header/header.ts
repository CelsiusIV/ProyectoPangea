import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatAnchor } from "@angular/material/button";
import { LoginBox } from '../login-box/login-box';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatAnchor],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly dialog = inject(MatDialog);
  isAuth = false;

  constructor(public authService: AuthService, private router: Router) { };

  checkAuthStatus(): void {
    this.authService.sesionCheck().subscribe(response => {
      this.isAuth = response;
      if (this.authService.currentUser() && this.isAuth) {
        this.router.navigate(['/privado']);
      } else {
        this.dialog.open(LoginBox);
      }
    });


  }

}
