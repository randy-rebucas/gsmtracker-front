import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppointmentsService } from '../appointments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';

export interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {

  public form: FormGroup;
  public formId: string;
  public formTitle: string;
  public formButtontext: string;
  public userType: string;
  public isLoading: boolean;
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  public filteredUsers: User[] = [];
  public currentDate = new Date();

  id: string;
  title: string;
  start: string;
  end: string;
  clientId: string;

  fullname: string;
  gender: string;
  address: string;
  birthdate: string;
  contact: string;
  type: number;
  status: number;
  detailId: string;

  constructor(
    private notificationService: NotificationService,
    private appointmentsService: AppointmentsService,
    private userService: UserService,
    private dialogRef: MatDialogRef < AppointmentFormComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.formId = data.id;
    this.formTitle = data.title;
    this.formButtontext = data.button;

    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {

    if (this.formId) {
      this.appointmentsService.get(this.formId).subscribe((appointment) => {
        console.log(appointment);
        this.id = appointment.id;
        this.title = appointment.title;
        this.start = appointment.start;
        this.status = appointment.status;

        this.fullname = appointment.fullname;
        this.gender = appointment.gender;
        this.address = appointment.address;
        this.birthdate = appointment.birthdate;
        this.contact = appointment.contact;
        this.detailId = appointment.detailId;
      });
    }

    this.form = new FormGroup({
      userInput: new FormControl(null),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
      }),
      start: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.form
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.userService.search({name: value}, this.currentPage)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((users) => {
        this.filteredUsers = users.results;
      });
  }

  displayFn(user: User) {
    if (user) {
      return user.name;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const newAppointment = {
      users: this.form.value.userInput,
      title: this.form.value.title,
      start: this.form.value.start
    };

    this.appointmentsService.insert(newAppointment).subscribe(() => {
      this.onClose();
      this.notificationService.success(':: Added successfully');
      this.appointmentsService.getAll(this.perPage, this.currentPage);
    });
  }

  onUpdate(id: string, state: number) {

    const updatedAppointment = {
      appointmentId: id,
      status: state
    };
    this.appointmentsService.update(updatedAppointment).subscribe(() => {
      this.onClose();
      this.notificationService.success(':: Updated successfully');
      this.appointmentsService.getAll(this.perPage, this.currentPage);
    });
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

}
