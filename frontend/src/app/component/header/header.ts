import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatAnchor } from "@angular/material/button";
import { LoginBox } from '../login-box/login-box';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatAnchor] /*Al importarlo permite usarlo*/ /*Al importarlo permite usarlo*/,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly dialog = inject(MatDialog);
  openDialog(): void {
    this.dialog.open(LoginBox);
  }
}
