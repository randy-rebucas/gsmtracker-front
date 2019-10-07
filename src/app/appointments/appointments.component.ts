import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointments.component.html',
  styles: [`
  .appointment-form {
    min-width: 25%;
    flex: 1 1 auto;
  }
  .appointment-outlet {
    min-width: 70%;
    flex: 1 1 auto;
  }
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  .mat-card-header .mat-card-title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 400;
  }
  .action-button {
    margin-bottom: 1em;
  }
  span.holiday-name {
    width: 70%;
  }
  span.holiday-date {
    text-align: right;
    width: 30%;
  }
  `]
})
export class AppointmentsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public isCalendarView = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public titleService: Title
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Appointments');
  }

  onCalendarView() {
    this.isCalendarView = ! this.isCalendarView;
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
