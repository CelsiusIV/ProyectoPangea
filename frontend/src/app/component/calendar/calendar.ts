import { DatePipe } from '@angular/common';
import { Classes, ClassType } from '../../shared/models/classes.interface';
import { MatDialog } from '@angular/material/dialog';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  provideCalendar, CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarPreviousViewDirective, CalendarTodayDirective,
  CalendarNextViewDirective, CalendarMonthViewComponent, CalendarDatePipe, DateAdapter
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormsModule } from '@angular/forms';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NewSchedule } from './new-schedule/new-schedule';
import { ClassesService } from '../../service/classes-service';
import { ClassTypeService } from '../../service/class-type-service';
import { EditEvent } from './edit-event/edit-event';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { ListUsersInClass } from './list-users-in-class/list-users-in-class';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  imports: [CommonModule, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, FormsModule, CalendarDatePipe, DatePipe, MatButtonModule, MatIcon],
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
})
export class Calendar {

  constructor(private classesService: ClassesService, private classTypeService: ClassTypeService) { }
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  view: CalendarView = CalendarView.Month;
  classTypeName: ClassType[] = [];
  schedules: Classes[] = [];
  events: CalendarEvent[] = [];

  ngOnInit(): void {
    this.getSchedulesList();
    this.classTypeService.getClassTypes().subscribe({
      next: (response) => {
        this.classTypeName = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }


  getSchedulesList(): void {
    this.classesService.getClasses().subscribe({
      next: (response) => {
        this.schedules = response.data;

        this.events = [];
        for (let schedule of this.schedules) {
          let eventColor;
          switch (schedule.class_type.id) {
            case 1:
              eventColor = { ...colors['red'] };
              break;
            case 2:
              eventColor = { ...colors['yellow'] };
              break;
            default:
              eventColor = { ...colors['blue'] };
              break;
          };

          this.events.push({
            start: new Date(schedule.beginDate),
            end: new Date(schedule.endDate),
            title: schedule.class_type.className + " " + formatDate(schedule.beginDate, "HH:mm"),
            color: eventColor,
            id: schedule.id,
            meta: { maxStudents: schedule.maxStudents, classTypeID: schedule.class_type.id }
          })

        }

        this.refresh.next();
      },
      error: (error) => {
        console.error('Error al obtener horarios:', error);
      }
    });
  }


  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = false;

  private modal = inject(NgbModal);

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  handleEvent(event: CalendarEvent): void {
    this.dialog.open(EditEvent, { data: { event, classType: this.classTypeName } });
  }
  showList(event: CalendarEvent): void {
    this.dialog.open(ListUsersInClass, { data: { event } });
  }

  addEvent(event: any): void {
    const dialogRef = this.dialog.open(NewSchedule, { data: { event, classType: this.classTypeName } });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.getSchedulesList();
      }
    });

  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const eventID: number = Number(eventToDelete.id);
    if (confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      if (eventID !== undefined) {
        this.classesService.delete(eventID).subscribe({
          next: (response) => {
            console.log(`Clase eliminada correctamente.`, response);
            this.getSchedulesList();
          },
          error: (error) => {
            console.error(`Error al eliminar la clase:`, error);
          }
        })
      } else {
        console.error('Error: El evento no tiene un ID válido para la actualización.');
      }
    } else {
      console.warn('Ha habido un error.');
    }

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
