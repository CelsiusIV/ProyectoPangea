import { Component, Inject, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassesService } from '../../../service/classes-service';
import { ClassType } from '../../../shared/models/classes.interface';
import { formatDate } from 'date-fns';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-new-schedule',
  imports: [MatRadioModule,MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-schedule.html',
  styleUrl: './new-schedule.css',
})
export class NewSchedule {
  readonly #formBuilder = inject(FormBuilder);
  typeClassNames: ClassType[] = [];
  eventDay: any;
  newScheduleForm: FormGroup;

  constructor(
    private classService: ClassesService,
    @Inject(MAT_DIALOG_DATA) public data: { event: any, classType: ClassType[] }, private dialogRef: MatDialogRef<NewSchedule>
  ) {
    this.typeClassNames = data.classType;
    this.eventDay = formatDate(data.event.date,"yyyy-MM-dd'T'09:30");

    this.newScheduleForm = this.#formBuilder.group({
      beginDate: [this.eventDay, Validators.required],
      duracion: ['2', Validators.required],
      maxStudents: [5, Validators.required],
      class_type_id: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.newScheduleForm.valid) {
      const endDate: Date = new Date (this.newScheduleForm.value.beginDate);
      endDate.setHours(endDate.getHours() + Number(this.newScheduleForm.value.duracion));

      const scheduleJson = {
        beginDate: this.newScheduleForm.value.beginDate,
        endDate: formatDate(endDate,"yyyy-MM-dd'T'09:30"),
        maxStudents: this.newScheduleForm.value.maxStudents,
        class_type_id: this.newScheduleForm.value.class_type_id
      }
      this.classService.post(scheduleJson).subscribe({
        next: (response) => {
          console.log('Formulario enviado con éxito:');
          this.dialogRef.close({ created: true });
          console.log(scheduleJson);      
        },
        error: (error) => {
          console.log('El formulario no es válido.', error);
          console.log(scheduleJson);        }

      });
    };
  }
}
