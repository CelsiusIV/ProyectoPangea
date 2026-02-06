import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { ClassesTable } from "../../../component/classes-table/classes-table";
import { MatTableDataSource } from '@angular/material/table';
import { ClassType } from '../../../shared/models/classes.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WarningDialog } from '../../../component/warning-dialog/warning-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClassTypeService } from '../../../service/class-type-service';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-administration',
  imports: [MatFormField, MatLabel, ClassesTable, ReactiveFormsModule, MatInput, MatSlideToggleModule],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class Administration {
  readonly #formBuilder = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  classTypes = new MatTableDataSource<ClassType>();
  classTypeForm: FormGroup = this.#formBuilder.group({
    className: ['', Validators.required],
    classLimit: ['', Validators.required],
    price: [''],
    is_available: [1]
  })
  constructor(
    private classTypeService: ClassTypeService,
  ) {
  }
  ngOnInit() {
    this.getClassTypes();
  }

  getClassTypes() {
    this.classTypeService.getClassTypes().subscribe({
      next: (response) => {
        this.classTypes.data = response.data;
      },
      error: () => {
      }
    })
  }
  onSubmit() {
    if (this.classTypeForm.valid) {
      this.classTypeService.post(this.classTypeForm.value).subscribe({
        next: () => {
           this.getClassTypes();
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al crear la clase: ' + error.error.message } });
        }

      });
    };
  }
}
