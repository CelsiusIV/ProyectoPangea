import { Component } from '@angular/core';
import { Calendar } from "../../../component/calendar/calendar";
import { BookingClassService } from '../../../service/booking-class-service';

@Component({
  selector: 'app-schedules',
  imports: [Calendar],
  templateUrl: './schedules.html',
  styleUrl: './schedules.css'
})
export class Schedules {
  constructor(private bookingService: BookingClassService) { }

}
