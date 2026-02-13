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
export class EditClassDialog implements OnInit {

  //Variables
  classType: ClassType;
  readonly #formBuilder = inject(FormBuilder);
  editClassForm: FormGroup;
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorLimiteClases = false;
  errorMessage = "";
  errorLimiteClasesMessage = "Mínimo 1, máximo 8";

  // Constructor
  constructor(
    private classTypeService: ClassTypeService, public dialogRef: MatDialogRef<EditClassDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { classType: ClassType }) { // Nos traemos el classType del padre
    this.classType = data.classType;

    // Formulario para la edición de la clase con sus validadores
    this.editClassForm = this.#formBuilder.group({
      className: ['', Validators.required],
      classLimit: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      price: [''],
      is_available: ['']
    })
  }

  // Funcion que realiza acciones justo al iniciar el componente
  ngOnInit(): void {
    if (this.classType) {
      // Rellena los datos del formulario con los datos del padre
      this.editClassForm.patchValue({
        className: this.classType.className,
        classLimit: this.classType.classLimit,
        price: this.classType.price,
        is_available: this.classType.is_available
      });
    }
  }

  // Submit de Edicion de clase
  onSubmit() {
    // Revisa que el formulario es válido
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
      // Si los datos no son válidos se generan diferentes mensajes según el problema
      this.errorForm = true;

      const controls = this.editClassForm.controls;
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

    }

  }
}
