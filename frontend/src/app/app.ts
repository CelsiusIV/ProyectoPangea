import { Component, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginBox } from './component/login-box/login-box';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-root',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  readonly dialog = inject(MatDialog);
  openDialog():void{
    this.dialog.open(LoginBox);
  }
}
