import { Component, Inject, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClassTypeService } from '../../service/class-type-service';
import { ClassType } from '../../shared/models/classes.interface';
import { WarningDialog } from '../warning-dialog/warning-dialog';
@Component({
  selector: 'app-edit-class-dialog',
  imports: [MatCheckboxModule, MatFormFieldModule, MatSlideToggleModule, ReactiveFormsModule, MatDialogContent, MatDialogActions, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-class-dialog.html',
  styleUrl: './edit-class-dialog.css',
})
export class EditClassDialog implements OnInit{
  classType: ClassType;
  readonly #formBuilder = inject(FormBuilder);
  editClassForm: FormGroup;
  readonly dialog = inject(MatDialog);

  constructor(
    private classTypeService: ClassTypeService, public dialogRef: MatDialogRef<EditClassDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { classType: ClassType }) {
    this.classType = data.classType;
    this.editClassForm = this.#formBuilder.group({
      className: ['', Validators.required],
      classLimit: ['', Validators.required],
      price: [''],
      is_available: ['']
    })
  }

  ngOnInit(): void {
    if (this.classType) {
      this.editClassForm.patchValue({
        className: this.classType.className,
        classLimit: this.classType.classLimit,
        price: this.classType.price,
        is_available: this.classType.is_available
      });
    }
  }
  onSubmit() {
    if (this.editClassForm.valid) {
      const payload = { ...this.editClassForm.value };
      this.classTypeService.put(this.classType.id, payload).subscribe({
        next: () => {
          this.dialogRef.close({ created: true });
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al editar la clase: ' + error.error.message } });
        }
      })
    } else {
      this.editClassForm.markAllAsTouched();
    }

  }
}
