import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassesService } from '../../../service/classes-service';
import { ClassType } from '../../../shared/models/classes.interface';
import { formatDate } from 'date-fns';
import { MatRadioModule } from '@angular/material/radio';
import { WarningDialog } from '../../warning-dialog/warning-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-new-schedule',
  imports: [MatTooltipModule, MatRadioModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-schedule.html',
  styleUrl: './new-schedule.css',
})
export class NewSchedule {

  //Variables
  readonly #formBuilder = inject(FormBuilder);
  typeClassNames: ClassType[] = [];
  eventDay: any;
  newScheduleForm: FormGroup;
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorMessage = "";
  errorAlumnosMessage = "Mínimo 1, máximo 20";

  //Constructor
  constructor(
    private classService: ClassesService,
    @Inject(MAT_DIALOG_DATA) public data: { event: any, classType: ClassType[] }, private dialogRef: MatDialogRef<NewSchedule>
  ) {
    this.typeClassNames = data.classType;
    this.eventDay = formatDate(data.event.date, "yyyy-MM-dd'T'09:30");

    // Formulario de Nueva Clase con sus validadores
    this.newScheduleForm = this.#formBuilder.group({
      beginDate: [this.eventDay, Validators.required],
      duration: ['2', Validators.required],
      maxStudents: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      class_type_id: [1, Validators.required]
    })
  }

  // Submit de AÑADIR nueva clase.
  onSubmit() {
    if (this.newScheduleForm.valid) {
      // Definimos el endDate a través de la duracion y el beginDate del formulario
      const startDate: Date = new Date(this.newScheduleForm.value.beginDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Number(this.newScheduleForm.value.duration));

      // Definimos el json para enviarlo
      const scheduleJson = {
        beginDate: formatDate(startDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: formatDate(endDate, "yyyy-MM-dd'T'HH:mm"),
        maxStudents: this.newScheduleForm.value.maxStudents,
        class_type_id: this.newScheduleForm.value.class_type_id
      }
      this.classService.post(scheduleJson).subscribe({
        next: () => {
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al crear la clase: ' + error.error.message } });
        }

      });
    } else {
       // Si los datos no son válidos se generan diferentes mensajes según el problema
      this.errorForm = true;

      const controls = this.newScheduleForm.controls;
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
        this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      } else if (hasFormatError) {
        this.errorMessage = "Hay campos con formato inválido";
      } else {
        this.errorMessage = "Hay errores en el formulario. Por favor, revísalo.";
      }
    };
  }
}
