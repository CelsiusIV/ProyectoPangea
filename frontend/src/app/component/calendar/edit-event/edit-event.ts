import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  // Variables
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

  // Constructor
  constructor(
    private classService: ClassesService,
    public dialogRef: MatDialogRef<EditEvent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      event: CalendarEvent, classType: ClassType[] // Nos traemos el evento y los tipos de clase del padre
    }
  ) {
    this.event = data.event;
    this.typeClassNames = data.classType;
    this.dateBegin = formatDate(this.event.start, "yyyy-MM-dd'T'HH:mm");
    // Definimos la duración de la clase
    if (this.event.start && this.event.end) {
      this.duration = (this.event.end?.getTime() - this.event.start.getTime()) / (1000 * 60 * 60);
    }

    // Formulario de edición de clase con validadores
    this.editEventForm = this.#formBuilder.group({
      beginDate: [this.dateBegin, Validators.required],
      duration: [this.duration?.toString(), Validators.required],
      maxStudents: [this.event.meta.maxStudents, [Validators.required, Validators.min(1), Validators.max(20)]],
      class_type_id: [this.event.meta.classTypeID, Validators.required]
    });
  }


  // Submit de Edicion de clase
  onSubmit() {

    // Comprobamos que los datos del formulario son válidos
    if (this.editEventForm.valid) {
      // Definimos el endDate a través de la duracion y el beginDate del formulario
      const startDate: Date = new Date(this.editEventForm.value.beginDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Number(this.editEventForm.value.duration));

      //Guardamos el eventID
      const eventID: number = Number(this.event.id);

      // Definimos el json para enviarlo
      const scheduleJson = {
        beginDate: formatDate(startDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: formatDate(endDate, "yyyy-MM-dd'T'HH:mm"),
        maxStudents: this.editEventForm.value.maxStudents,
        class_type_id: this.editEventForm.value.class_type_id
      }

      // Revisamos que el ID es válido
      if (eventID !== undefined) {
        // Guardamos la clase con una llamada a la api
        this.classService.put(eventID, scheduleJson).subscribe({
          next: () => {
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
      // Si los datos no son válidos se generan diferentes mensajes según el problema
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

      if (hasRequiredError) {
        this.errorAlumnos = false;
        this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      } else if (hasFormatError) {
        this.errorAlumnos = true;
        this.errorMessage = "Hay campos con formato inválido";
      } else {
        this.errorMessage = "Hay errores en el formulario. Por favor, revísalo.";
      }
    };
  }
}

