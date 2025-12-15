import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from "../../../component/calendar/calendar";
import { BookingClassService } from '../../../service/booking-class-service';

@Component({
  selector: 'app-schedules',
  imports: [RouterOutlet, Calendar],
  templateUrl: './schedules.html',
  styleUrl: './schedules.css'
})
export class Schedules {
  constructor(private bookingService: BookingClassService) { }

}
