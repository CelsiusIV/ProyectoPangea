import { Component, input } from '@angular/core';
import { MatTableDataSource, MatTableModule, MatHeaderCellDef, MatCellDef, MatHeaderRowDef } from '@angular/material/table';
import { Payments } from '../../shared/models/classes.interface';


@Component({
  selector: 'app-payment-table',
  imports: [MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatTableModule],
  templateUrl: './payment-table.html',
  styleUrl: './payment-table.css',
})
export class PaymentTable {
  payments = input.required<MatTableDataSource<Payments>>();
  displayedColumns: string[] = ['payDate', 'classType', 'availableClasses'];

}
