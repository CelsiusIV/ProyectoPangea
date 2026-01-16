import { Component, OnInit } from '@angular/core';
import { Calendar } from "../../../component/calendar/calendar";


@Component({
  selector: 'app-dashbord',
  imports: [Calendar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  currentUser: any;

}
