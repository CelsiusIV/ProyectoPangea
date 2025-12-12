import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CalendarEvent } from 'angular-calendar';
import { ClassesService } from '../../../service/classes-service';
import { Classes, ClassType } from '../../../shared/models/classes.interface';
import { formatDate } from 'date-fns';

@Component({
  selector: 'app-edit-event',
  imports: [MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css',
})
export class EditEvent {
  event: CalendarEvent;
  editEventForm: FormGroup;
  readonly #formBuilder = inject(FormBuilder);
  typeClassNames: ClassType[] = [];
  dateBegin: string;
  dateEnd: string;

  constructor(
    private classService: ClassesService,
    public dialogRef: MatDialogRef<EditEvent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent, classType: ClassType[] }
  ) {
    this.event = data.event;
    this.typeClassNames = data.classType;
    this.dateBegin = formatDate(this.event.start, "yyyy-MM-dd'T'HH:mm");
    if (this.event.end) {
      this.dateEnd = formatDate(this.event.end, "yyyy-MM-dd'T'HH:mm");
    } else {
      this.dateEnd = "";
    }
    this.editEventForm = this.#formBuilder.group({
      beginDate: [this.dateBegin, Validators.required],
      endDate: [this.dateEnd, Validators.required],
      maxStudents: [this.event.meta.maxStudents, Validators.required],
      class_type_id: [this.event.meta.classTypeID, Validators.required]
    });
  }
  onSubmit() {
    if (this.editEventForm.valid) {
      const eventID: number = Number(this.event.id);
      if (eventID !== undefined) {
        this.classService.put(eventID, this.editEventForm.value).subscribe({
          next: (response) => {
            console.log('Formulario enviado con éxito:', response);
          },
          error: (error) => {
            console.log('El formulario no es válido.', error);
          }
        })
      } else {
        console.error('Error: El evento no tiene un ID válido para la actualización.');
      }
    } else {
      console.warn('El formulario no es válido.');
    }
  }
}
