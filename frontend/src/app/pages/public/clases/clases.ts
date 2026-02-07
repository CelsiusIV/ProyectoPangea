import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewuserBox } from '../../../component/newuser-box/newuser-box';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clases',
  imports: [RouterModule],
  templateUrl: './clases.html',
  styleUrl: './clases.css',
})
export class Clases {
  private dialog = inject(MatDialog);
  navegarARegistro() {
    this.dialog.open(NewuserBox);
  }
}
