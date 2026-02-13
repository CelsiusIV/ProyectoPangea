import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginBox } from '../login-box/login-box';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../service/auth-service';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIcon, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // Variables
  readonly dialog = inject(MatDialog);
  isAuth = false;
  menuOpen = false;


  // Funciones para la apertura y cerrado del menu en modo movil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // constructor
  constructor(public authService: AuthService, private router: Router) { };

  // Chequeo del logueo, si no se está logueado te muestra el login box, sino te lleva a la zona privada
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
