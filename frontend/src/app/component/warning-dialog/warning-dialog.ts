import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-warning-dialog',
  imports: [MatDialogActions, MatDialogContent, MatButtonModule, MatIconModule],
  templateUrl: './warning-dialog.html',
  styleUrl: './warning-dialog.css',
})
export class WarningDialog {
  private dialogRef = inject(MatDialogRef<boolean>);
  message: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    this.message = data.message;
  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
