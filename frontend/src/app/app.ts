import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './component/header/header';
import { Footer } from './component/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { LoginBox } from './component/login-box/login-box';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MatButtonModule],
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
