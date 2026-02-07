import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CalendarEvent } from 'angular-calendar';
import { ClassesService } from '../../../service/classes-service';
import { ClassType } from '../../../shared/models/classes.interface';
import { formatDate } from 'date-fns';
import { MatRadioModule } from "@angular/material/radio";
import { WarningDialog } from '../../warning-dialog/warning-dialog';

@Component({
  selector: 'app-edit-event',
  imports: [MatFormFieldModule, MatSelect, MatOption, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule, MatRadioModule],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css',
})
export class EditEvent {
  event: CalendarEvent;
  editEventForm: FormGroup;
  readonly #formBuilder = inject(FormBuilder);
  typeClassNames: ClassType[] = [];
  dateBegin: string;
  readonly dialog = inject(MatDialog);
  duration?: number;
  errorForm = false;
  errorAlumnos = false;
  errorMessage = "";
  errorAlumnosMessage = "Mínimo 1, máximo 20";


  constructor(
    private classService: ClassesService,
    public dialogRef: MatDialogRef<EditEvent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent, classType: ClassType[] }
  ) {
    this.event = data.event;
    this.typeClassNames = data.classType;
    this.dateBegin = formatDate(this.event.start, "yyyy-MM-dd'T'HH:mm");
    if (this.event.start && this.event.end) {
      this.duration = (this.event.end?.getTime() - this.event.start.getTime()) / (1000 * 60 * 60);
    }
    this.editEventForm = this.#formBuilder.group({
      beginDate: [this.dateBegin, Validators.required],
      duration: [this.duration?.toString(), Validators.required],
      maxStudents: [this.event.meta.maxStudents, [Validators.required, Validators.min(1), Validators.max(20)]],
      class_type_id: [this.event.meta.classTypeID, Validators.required]
    });
  }
  onSubmit() {
    if (this.editEventForm.valid) {
      const startDate: Date = new Date(this.editEventForm.value.beginDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Number(this.editEventForm.value.duration));
      const eventID: number = Number(this.event.id);

      const scheduleJson = {
        beginDate: formatDate(startDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: formatDate(endDate, "yyyy-MM-dd'T'HH:mm"),
        maxStudents: this.editEventForm.value.maxStudents,
        class_type_id: this.editEventForm.value.class_type_id
      }
      if (eventID !== undefined) {
        this.classService.put(eventID, scheduleJson).subscribe({
          next: (response) => {
            this.dialogRef.close({ created: true });
          },
          error: (error) => {
            this.dialog.open(WarningDialog, { data: { message: 'Error: ' + error.error.message } });
          }
        })
      } else {
        this.dialog.open(WarningDialog, { data: { message: 'Error, ID no válido' } });
      }
    } else {
      this.errorForm = true;

      const controls = this.editEventForm.controls;
      let hasRequiredError = false;
      let hasFormatError = false;

      for (const name in controls) {
        const errors = controls[name].errors;
        if (errors) {
          if (errors['required']) hasRequiredError = true;
          if (errors['min'] || errors['max']) hasFormatError = true;
        }
      }

      // Definimos el mensaje estándar según lo encontrado
      if (hasRequiredError) {
        this.errorAlumnos=false;
        this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      } else if (hasFormatError) {
        this.errorAlumnos=true;
        this.errorMessage = "Hay campos con formato inválido";
      } else {
        this.errorMessage = "Hay errores en el formulario. Por favor, revísalo.";
      }
    };
  }
}

