import { CommonModule, DatePipe } from '@angular/common';
import { Classes, ClassType } from '../../shared/models/classes.interface';
import { MatDialog } from '@angular/material/dialog';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, inject } from '@angular/core';
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
import { ListUsersInClass } from './list-users-in-class/list-users-in-class';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog';
import { WarningDialog } from '../warning-dialog/warning-dialog';
import { AuthService } from '../../service/auth-service';

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
  imports: [CommonModule, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, FormsModule, CalendarDatePipe, DatePipe, MatButtonModule],
  providers: [
    provideFlatpickrDefaults(),
    provideCalendar({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
})
export class Calendar {
  // Definición de variables
  view: CalendarView = CalendarView.Month;
  classTypeName: ClassType[] = [];
  schedules: Classes[] = [];
  events: CalendarEvent[] = [];

  // Constructor y definicion de servicios
  constructor(
    private classesService: ClassesService,
    private classTypeService: ClassTypeService,
    public authService: AuthService,
  ) { }

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);

  // Funcion ngOnInit(). Carga las clases y los tipos de clases
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

  // Función getSchedulesList(). Obtiene las clases de la bbdd y las guarda en tipo event.
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
            title: schedule.class_type.className + " " + formatDate(schedule.beginDate, "HH:mm") + " - " + formatDate(schedule.endDate, "HH:mm"),
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

  // Propiedades de Angular Calendar
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

  // Abre dialogo para editar una clase
  handleEvent(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EditEvent, { data: { event, classType: this.classTypeName } });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.created) {
        this.getSchedulesList();
      }
    });

  }

  // Abre un dialogo para ver los usuarios apuntados a una clase
  showList(event: CalendarEvent): void {
    const role = this.authService.currentUser()?.role?.role_name;
    if (role == 'registrado') {
      return;
    }
    this.dialog.open(ListUsersInClass, { data: { event } });
  }

  // Abre un dialogo para añadir una nueva clase
  addEvent(event: any): void {
    const role = this.authService.currentUser()?.role?.role_name;
    if (role !== 'admin' && role !== 'profesor') {
      return;
    }
    const dialogRef = this.dialog.open(NewSchedule, { data: { event, classType: this.classTypeName } });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.created) {
        this.getSchedulesList();
      }
    });

  }

  // Borra una clase
  deleteEvent(eventToDelete: CalendarEvent) {
    const eventID: number = Number(eventToDelete.id);
    const dialogDEL = this.dialog.open(DeleteConfirmationDialog, { data: { message: '¿Estas seguro de querer borrar esta clase?' } });

    dialogDEL.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.classesService.delete(eventID).subscribe({
          next: (response) => {
            this.getSchedulesList();
          },
          error: (error) => {
            this.dialog.open(WarningDialog, { data: { message: 'No se ha podido borrar la clase. Hay alumnos apuntados.' } });
          }
        });
      }
    });

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
