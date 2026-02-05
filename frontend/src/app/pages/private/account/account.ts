import { Component, inject, numberAttribute } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { UserService } from '../../../service/user-service';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../service/auth-service';
import { ClassType, Payments } from '../../../shared/models/classes.interface';
import { ClassTypeService } from '../../../service/class-type-service';
import { PaymentService } from '../../../service/payment-service';
import { PaymentTable } from "../../../component/payment-table/payment-table";
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatTabsModule, MatCheckboxModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule, PaymentTable],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  readonly #formBuilder = inject(FormBuilder);
  user: any;
  editUserForm: FormGroup;
  paymentForm: FormGroup;
  classNames: ClassType[] = [];
  classLimit: number = 0;
  payments = new MatTableDataSource<Payments>();
  paymentsPending = new MatTableDataSource<Payments>();
  paymentsHistory = new MatTableDataSource<Payments>();

  constructor(
    private userService: UserService, public authService: AuthService, private classTypeService: ClassTypeService, private paymentService: PaymentService
  ) {
    this.user = authService.currentUser();
    this.editUserForm = new FormGroup({
      password: new FormControl(''),
      first_name: new FormControl(this.user.first_name, Validators.required),
      last_name: new FormControl(this.user.last_name),
      birth_date: new FormControl<Date | null>(this.user.birth_date),
      phone: new FormControl<string | null>(this.user.phone, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      is_active: new FormControl<boolean>({ value: this.user.is_active, disabled: true }),
      role_id: new FormControl<number>({ value: this.user.role.id, disabled: true })
    });

    this.paymentForm = new FormGroup({
      classType_id: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.getPaymentList(this.user.id);
  }

  getClassList() {
    const activeClass: number[] = this.paymentsPending.data.map(p => p.class_type.id);
    this.classTypeService.getClassTypes().subscribe({
      next: (response) => {
        this.classNames = response.data.filter((classes: ClassType) => !activeClass.includes(classes.id));
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getPaymentList(id: number) {
    this.paymentService.getUserPayment(id).subscribe({
      next: (response) => {
        this.paymentsPending.data = [...response.data].filter(p => p.availableClasses > 0);
        this.paymentsHistory.data = [...response.data].filter(p => p.availableClasses == 0);
        this.getClassList();
      },
      error: (error) => {
        console.error('Error al obtener los pagos:', error);
      }
    })
  }
  onSubmitEdit() {
    if (this.editUserForm.valid) {
      const payload = { ...this.editUserForm.getRawValue() };
      if (!payload.password) {
        delete payload.password;
      }
      this.userService.put(this.user.id, payload).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.currentUser.set(response);
          localStorage.setItem('auth_user', JSON.stringify(response));
          console.log('Formulario enviado con éxito:', response);
        },
        error: (error) => {
          console.log(this.editUserForm.value);
          console.log('El formulario no es válido.', error);
        }
      })
    } else {
      Object.entries(this.editUserForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.warn(`Control inválido: ${key}`, control.errors, control.value);
        }
      });
    }
  }

  onSubmitPay() {
    const now = new Date();
    const fechaFormateada = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (this.paymentForm.valid) {
      this.classTypeService.getClassType(this.paymentForm.value.classType_id).subscribe({
        next: (response) => {
          this.classLimit = response.data.classLimit;
          const paymentJson = {
            'user_id': this.user.id,
            'class_type_id': this.paymentForm.value.classType_id,
            'paymentDate': fechaFormateada,
            'availableClasses': this.classLimit
          }
          this.paymentService.post(paymentJson).subscribe({
            next: () => {
              this.getPaymentList(this.user.id);
              this.authService.refreshUser().subscribe({
                next: () => {
                },
                error: (err) => {
                  console.error('Error al refrescar:', err);
                }
              });;

            },
            error: (error) => {
              console.log('El formulario no es válido.', error);
            }
          })
        },
        error: (error) => {
          console.log('Ha habido un error al intentar hacer la peticion');
        }
      })

    }
  }
}
