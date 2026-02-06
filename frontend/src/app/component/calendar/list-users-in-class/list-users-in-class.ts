import { Component, inject, Inject, output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogClose, MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
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
import { User } from '../../../shared/models/user.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationDialog } from '../../delete-confirmation-dialog/delete-confirmation-dialog';
import { AuthService } from '../../../service/auth-service';
import { UserService } from '../../../service/user-service';
import { PaymentService } from '../../../service/payment-service';
import { Payments } from '../../../shared/models/classes.interface';
import { WarningDialog } from '../../warning-dialog/warning-dialog';


@Component({
  selector: 'app-list-users-in-class',
  imports: [ReactiveFormsModule, MatExpansionModule, FormsModule, MatCheckboxModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule, MatDialogContent, MatIcon, MatDialogClose],
  templateUrl: './list-users-in-class.html',
  styleUrl: './list-users-in-class.css',
})
export class ListUsersInClass {
  event: CalendarEvent;
  userList: User[] = [];
  allUserList: User[] = [];
  displayedColumns: string[] = ['name', 'attendance', 'actions'];
  loading: boolean = true;
  amIBooked: boolean = false;
  myBooking: any = null;
  payments: Payments[] = [];


  readonly #formBuilder = inject(FormBuilder);
  newUserBooking: FormGroup = this.#formBuilder.group({
    userBooking: [null as User | null, Validators.required]
  })
  constructor(private dialog: MatDialog, private paymentService: PaymentService, private userService: UserService, private bookingService: BookingClassService, public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent }
  ) {
    this.event = data.event;
  }

  ngOnInit(): void {
    this.getUsersBookingList();
    const role = this.authService.currentUser()?.role?.role_name;
    if (role !== 'admin' && role !== 'profesor') {
      this.displayedColumns = ['name'];
      this.newUserBooking.get('userBooking')?.clearValidators();
      this.newUserBooking.get('userBooking')?.updateValueAndValidity();
    }
  }
  toggleAttendance(user: any) {
    const status = !user.attendance;
    this.bookingService.put(user.bookingId, { user_id: user.id, class_id: user.classId, attendance: status }).subscribe({
      next: () => { this.getUsersBookingList(); },
      error: (error) => this.dialog.open(WarningDialog, { data: { message: 'Error actualizando la asistencia: ' + error.error.message } })
    });
  }
  deleteUserBooking(bookingID: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, { data: { message: '¿Estas seguro de querer borrar el usuario de esta reserva?' } });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookingService.delete(bookingID).subscribe({
          next: () => {
            this.getUsersBookingList();
          },
          error: (error) => {
            this.dialog.open(WarningDialog, { data: { message: error.error.message } });
          }
        });
      }
    });
  }

  getUserList(): void {
    const bookedIDs: number[] = this.userList.map(u => u.id);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.allUserList = response.data.filter((u: User) => !bookedIDs.includes(u.id) && u.role.role_name == 'alumno');
        const userListSelect = this.newUserBooking.get('userBooking');
        if (this.allUserList.length === 0) {
          userListSelect?.disable(); 
        } else {
          userListSelect?.enable();  
        }
      },
      error: () => {
      }
    });
  }
  getUsersBookingList(): void {
    const myId = this.authService.currentUser()?.id;
    const eventID: number = Number(this.event.id);
    if (!eventID) {
      return ;
    }
    this.bookingService.getBookingClass(eventID).subscribe({
      next: (response) => {
        this.userList = response.data.map((booking: any) => {
          return {
            ...booking.user,
            bookingId: booking.id,
            classId: booking.class.id,
            attendance: booking.attendance
          }
        });
        this.amIBooked = this.userList.some(user => user.id === myId);
        this.myBooking = this.userList.find(user => user.id === myId);
        this.getUserList();
      },
      error: () => {
        this.userList = [];
      },
      complete: () =>
        this.loading = false
    })
  }
  onSubmit() {
    if (this.newUserBooking.invalid) {
      return;
    }
    const selectedUser: User = this.newUserBooking.value.userBooking ?? this.authService.currentUser();
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
        this.dialog.open(WarningDialog, { data: { message: error.error.message } });

      }

    });
  };
}



