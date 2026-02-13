import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../service/user-service';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { WarningDialog } from '../../../component/warning-dialog/warning-dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatDate } from 'date-fns';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [MatDatepickerModule, MatTabsModule, MatCheckboxModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDialogModule, MatIconModule, MatButtonModule, PaymentTable],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  // Variables
  readonly #formBuilder = inject(FormBuilder);
  user: any;
  editUserForm: FormGroup;
  paymentForm: FormGroup;
  classNames: ClassType[] = [];
  classLimit: number = 0;
  payments = new MatTableDataSource<Payments>();
  paymentsPending = new MatTableDataSource<Payments>();
  paymentsHistory = new MatTableDataSource<Payments>();
  readonly dialog = inject(MatDialog);
  errorForm = false;
  errorPass = false;
  errorMessage = "";
  errorPassMessage = "Mínimo 8 caracteres y 1 número";

  // Constructor
  constructor(
    private userService: UserService, public authService: AuthService, private classTypeService: ClassTypeService, private paymentService: PaymentService
  ) {
    this.user = authService.currentUser();

    // Formulario de edición de usuario, con validaciones y rellenado con info de usuario autenticado
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

    // Formulario de pago de usuario, con validacion
    this.paymentForm = new FormGroup({
      classType_id: new FormControl('', Validators.required)
    })
  }

  // Funcion que realiza acciones justo al iniciar el componente
  ngOnInit(): void {
    this.getPaymentList(this.user.id);
  }

  // Funcion para obtener el listado de tipos de clases que existen
  getClassList() {
    // Filtramos por las clases activas que tiene el usuario para las diferentes tipos de clase
    const activeClass: number[] = this.paymentsPending.data.map(p => p.class_type.id);
    this.classTypeService.getClassTypes().subscribe({
      next: (response) => {
        // Filtramos por las clases que NO tienen clases activas.
        this.classNames = response.data.filter((classes: ClassType) => !activeClass.includes(classes.id));
      },
      error: () => {

      }
    })
  }

  // Funcion para obtener el listado de pagos realizados
  getPaymentList(id: number) {
    this.paymentService.getUserPayment(id).subscribe({
      next: (response) => {
        // Aqui guardamos los pagos con clases pendientes de consumir
        this.paymentsPending.data = [...response.data].filter(p => p.availableClasses > 0);
        // Aqui guardamos los pagos historicos con clases ya consumidas
        this.paymentsHistory.data = [...response.data].filter(p => p.availableClasses == 0);
        // Recargamos
        this.getClassList();
      }
    })
  }

  // Submit de Edicion de usuario
  onSubmitEdit() {
    if (this.editUserForm.valid) {
      const payload = { ...this.editUserForm.getRawValue() };
      // Ignoramos la contraseña si no se ha cambiado
      if (!payload.password) {
        delete payload.password;
      }

      //Formateamos la fecha de nacimiento
      if (payload.birth_date) {
        payload.birth_date = formatDate(payload.birth_date, 'yyyy-MM-dd');
      }
      this.userService.put(this.user.id, payload).subscribe({
        next: (response) => {
          this.authService.currentUser.set(response);
          localStorage.setItem('auth_user', JSON.stringify(response));
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Error al editar el perfil: ' + error.error.message } });
        }
      })
    } else {
      // Si los datos no son válidos se generan diferentes mensajes según el problema
      this.errorForm = true;

      const controls = this.editUserForm.controls;
      let hasRequiredError = false;
      let hasFormatError = false;

      for (const name in controls) {
        const errors = controls[name].errors;
        if (errors) {
          if (errors['required']) hasRequiredError = true;
          if (errors['pattern'] || errors['minlength'] || errors['email']) hasFormatError = true;
        }
      }

      // Definimos el mensaje estándar según lo encontrado
      if (hasRequiredError) {
        this.errorPass = false;
        this.errorMessage = "Por favor, completa todos los campos obligatorios.";
      } else if (hasFormatError) {
        this.errorPass = true;
        this.errorMessage = "La contraseña o el email no tienen un formato válido.";
      } else {
        this.errorMessage = "Hay errores en el formulario. Por favor, revísalo.";
      }
    }
  }

  // Submit de Pagos de usuario
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
                error: (error) => {
                  this.dialog.open(WarningDialog, { data: { message: 'Error al realizar el pago: ' + error.error.message } });
                }
              });;

            },
            error: (error) => {
              this.dialog.open(WarningDialog, { data: { message: 'Error al realizar el pago: ' + error.error.message } });
            }
          })
        },
        error: (error) => {
          this.dialog.open(WarningDialog, { data: { message: 'Ha habido un error: ' + error.error.message } });
        }
      })

    }
  }
}
