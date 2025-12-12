import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from "../../../component/calendar/calendar";


@Component({
  selector: 'app-schedules',
  imports: [RouterOutlet, Calendar],
  templateUrl: './schedules.html',
  styleUrl: './schedules.css'
})
export class Schedules {

}
