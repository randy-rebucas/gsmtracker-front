import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AppointmentService } from '../../appointments/appointment.service';
import { AppointmentData } from '../../appointments/appointment-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styles: [`
  mat-form-field {
    width: 100%;
  }
  table {
    width: 100%;
  }
  .form-field-block {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    flex-basis: auto;
  }

  mat-spinner {
    margin: auto;
  }

  .mat-dialog-title button {
    float: right;
    border: none;
  }

  .mat-dialog-title {
    border-bottom: 1px solid rgb(169, 169, 169);
    padding: 0 0 1em 0;
  }
  table.appointment-detail tr:nth-child(3) td {
    font-size: 16px;
      border-bottom: 1px solid #d0d0d0;
    padding-top: 2em;
  }
  tr.address td {
    vertical-align: text-bottom;
  }
  tr.address td div:first-child {
    border-bottom: 1px solid #d0d0d0;
  }
  tr.address td span {
    float: right;
    font-weight: 500;
    text-decoration: underline;
    color: #f5584d;
  }
  table.appointment-detail tr:nth-child(4) td {
    font-weight: 700;
    font-size: 16px;
    padding: .6em 0;
  }
  table.appointment-detail tr:first-child td {
    font-size: 18px;
    font-weight: 500;
  }
  `]
})
export class AppointmentDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  appointmentData: AppointmentData;

  id: string;
  title: string;
  start: Date;
  end: Date;
  clientId: string;

  fullname: string;
  gender: string;
  address: string;
  birthdate: string;
  contact: string;
  type: number;
  status: number;
  detailId: string;

  private appointmentId: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public appointmentService: AppointmentService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < AppointmentDetailComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.appointmentId = data.id;
    }

  ngOnInit() {
    super.doInit();

    this.appointmentService.get(this.appointmentId)
      .subscribe(recordData => {
        this.isLoading = false;
        this.id = recordData.appointmentId;
        this.title = recordData.title;
        this.start = recordData.start;
        this.status = recordData.status;

        this.fullname = recordData.fullname;
        this.gender = recordData.gender;
        this.address = recordData.address;
        this.birthdate = recordData.birthdate;
        this.contact = recordData.contact;
        this.detailId = recordData.detailId;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onUpdate(appointmentId, status) {
    this.appointmentService.update(
      appointmentId,
      status
    ).subscribe(() => {
      this.onClose();
      this.notificationService.success(':: Updated successfully');
      this.appointmentService.getAll(this.licenseId, this.perPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
