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

@Component({
  selector: 'app-new-schedule',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-schedule.html',
  styleUrl: './new-schedule.css',
})
export class NewSchedule {
  readonly #formBuilder = inject(FormBuilder);
  typeClassNames: ClassType[] = [];
  dateToday = new Date();
  newScheduleForm: FormGroup = this.#formBuilder.group({
    beginDate: ['', Validators.required],
    endDate: ['', Validators.required],
    maxStudents: [5, Validators.required],
    class_type_id: ['', Validators.required]
  })

  constructor(
    private classService: ClassesService,
    @Inject(MAT_DIALOG_DATA) public data: { classType: ClassType[] }
  ) {
    this.typeClassNames = data.classType;
  }


  onSubmit() {
    if (this.newScheduleForm.valid) {
      this.classService.post(this.newScheduleForm.value).subscribe({
        next: (response) => {
          console.log('Formulario enviado con éxito:', this.newScheduleForm.value);
        },
        error: (error) => {
          console.log('El formulario no es válido.', error);
          console.log(this.newScheduleForm.value.beginDate, " and ", this.newScheduleForm.value.endDate)
        }

      });
    };
  }
}
