import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { PatientsService } from 'src/app/patients/patients.service';

export interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  assessmentId: string;
  filteredUsers: User[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private appointmentService: AppointmentService,
    private patientsService: PatientsService,
    private notificationService: NotificationService
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

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
        switchMap(value => this.patientsService.search({name: value}, this.currentPage, this.licenseId)
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

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.appointmentService.insert(
      this.form.value.userInput,
      this.form.value.title,
      this.form.value.start,
      this.licenseId
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.appointmentService.getAll(this.licenseId, this.perPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    super.doDestroy();
  }
}
