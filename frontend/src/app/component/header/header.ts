import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule] /*Al importarlo permite usarlo*/,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
