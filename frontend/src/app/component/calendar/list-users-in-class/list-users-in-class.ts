import { Component, inject, Inject, output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogClose, MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { ClassesService } from '../../../service/classes-service';
import { CalendarEvent } from 'angular-calendar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BookingClassService } from '../../../service/booking-class-service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from '../../../service/user-service';
import { User } from '../../../shared/models/user.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationDialog } from '../../delete-confirmation-dialog/delete-confirmation-dialog';


@Component({
  selector: 'app-list-users-in-class',
  imports: [ReactiveFormsModule, MatExpansionModule, FormsModule, MatCheckboxModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule, MatDialogContent, MatIcon, MatDialogClose],
  templateUrl: './list-users-in-class.html',
  styleUrl: './list-users-in-class.css',
})
export class ListUsersInClass {
  event: CalendarEvent;
  users: any[] = [];
  userList: User[] = [];
  displayedColumns: string[] = ['username', 'attendance', 'actions'];
  loading: boolean = true;

  readonly #formBuilder = inject(FormBuilder);
  newUserBooking: FormGroup = this.#formBuilder.group({
    userBooking: [null as User | null, Validators.required]
  })
  constructor(private dialog: MatDialog, private userService: UserService, private classService: ClassesService, private bookingService: BookingClassService,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent }
  ) {
    this.event = data.event;
  }

  ngOnInit(): void {
    this.getUsersBookingList();
  }
  toggleAttendance(user: any) {
    const status = !user.attendance;
    this.bookingService.put(user.bookingID, { user_id: user.userID, class_id: user.classID, attendance: status }).subscribe({
      next: () => {this.getUsersBookingList(); },
      error: (err) => console.error('Error actualizando asistencia', err)
    });
  }
  deleteUserBooking(user: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, { data: { message: '¿Estas seguro de querer borrar el usuario de esta reserva?' } });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookingService.delete(user.bookingID).subscribe({
          next: () => {
            this.getUsersBookingList();
          },
          error: (error) => {
            console.error(`Error al eliminar la reserva`, error);
          }
        });
      }
    });
  }
  getUserList(): void {
      const bookedIDs: number[] = this.users.map(u => u.userID);
      this.userService.getUsers().subscribe({
        next: (response) => {
          this.userList = response.data.filter((u: User) => !bookedIDs.includes(u.id));
        },
        error: (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      });
    }
  getUsersBookingList(): void {

      const eventID: number = Number(this.event.id);
      if(!eventID) {
        return console.error('Error: El evento no tiene un ID válido para la actualización.');
      }
    this.classService.getClass(eventID).subscribe({
        next: (response) => {
          this.users = response.data.bookingclass.map((b: any) => ({
            bookingID: b.id,
            userID: b.user.id,
            classID: b.class.id,
            username: b.user.first_name + " " + b.user.last_name,
            attendance: Boolean(b.attendance)
          }))
          this.getUserList();
        },
        error: (error) => {
          console.error('El formulario no es válido.', error);
          this.users = [];
        },
        complete: () =>
          this.loading = false
      })
    }
  onSubmit() {
      if(this.newUserBooking.invalid) {
      return;
    }
    const selectedUser: User = this.newUserBooking.value.userBooking;
    const bookingJson = {
      user_id: selectedUser.id,
      class_id: Number(this.event.id),
      attendance: false
    }
    this.bookingService.post(bookingJson).subscribe({
      next: () => {
        this.getUsersBookingList();
      },
      error: (error) => {
        console.log('La reserva ha tenido un error: ', error);
      }

    });
  };
}



