import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule, MatHeaderCellDef, MatCellDef, MatHeaderRowDef } from '@angular/material/table';
import { ClassType } from '../../shared/models/classes.interface';
import { MatIcon } from "@angular/material/icon";
import { ClassTypeService } from '../../service/class-type-service';
import { EditClassDialog } from '../edit-class-dialog/edit-class-dialog';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialog } from '../delete-confirmation-dialog/delete-confirmation-dialog';
import { WarningDialog } from '../warning-dialog/warning-dialog';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'app-classes-table',
  imports: [MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatTableModule, MatIcon, MatIconButton, MatFormFieldModule],
  templateUrl: './classes-table.html',
  styleUrl: './classes-table.css',
})
export class ClassesTable {

  // Variables
  classTypes = input.required<MatTableDataSource<ClassType>>();
  displayedColumns: string[] = ['className', 'classLimit', 'price', 'availableClasses', 'actions'];
  readonly dialog = inject(MatDialog)
  @Output() refresh = new EventEmitter<void>(); // Permite la recarga de las clases

  // Constructor
  constructor(private classTypeService: ClassTypeService) { }

  // Funcion que abre la edicion de las clases
  editClassType(classType: ClassType) {
    const dialogEdit = this.dialog.open(EditClassDialog, {
      data: {
        classType: classType
      }
    });
    dialogEdit.afterClosed().subscribe(result => {
      this.refresh.emit();

    })

  }

  // Función para el borrado de las clases
  deleteClass(id: number) {
    const dialogDEL = this.dialog.open(DeleteConfirmationDialog, { data: { message: '¿Estas seguro de querer borrar esta clase?' } });

    dialogDEL.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.classTypeService.delete(id).subscribe({
          next: () => {
            this.refresh.emit();
          },
          error: (error) => {
            this.dialog.open(WarningDialog, { data: { message: 'No se ha podido borrar la clase, ' + error.error.message } });
          }
        });
      }
    });

  }
}
