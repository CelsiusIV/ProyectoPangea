import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel, MatHint } from "@angular/material/form-field";
import { ClassesTable } from "../../../component/classes-table/classes-table";
import { MatTableDataSource } from '@angular/material/table';
import { ClassType } from '../../../shared/models/classes.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WarningDialog } from '../../../component/warning-dialog/warning-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClassTypeService } from '../../../service/class-type-service';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-administration',
  imports: [MatFormField, MatLabel, ClassesTable, ReactiveFormsModule, MatInput, MatSlideToggleModule, MatHint],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class Administration {
  readonly #formBuilder = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorMessage = "";
  errorLimiteClasesMessage = "Mínimo 1, máximo 8";
  classTypes = new MatTableDataSource<ClassType>();
  classTypeForm: FormGroup = this.#formBuilder.group({
    className: ['', Validators.required],
    classLimit: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
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
    } else {
      this.errorForm = true;

      const controls = this.classTypeForm.controls;
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
