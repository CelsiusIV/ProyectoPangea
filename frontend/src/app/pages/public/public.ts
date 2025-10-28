import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../component/header/header';
import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-public',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './public.html',
  styleUrl: './public.css'
})
export class Public {

}
