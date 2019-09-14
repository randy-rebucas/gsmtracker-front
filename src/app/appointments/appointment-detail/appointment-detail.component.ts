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

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
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

    public appointmentService: AppointmentService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < AppointmentDetailComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog);
      this.appointmentId = data.id;
    }

  ngOnInit() {
    super.doInit();

    this.appointmentService.get(this.appointmentId)
      .subscribe(recordData => {
        this.isLoading = false;
        this.id = recordData._id;
        this.title = recordData.title;
        this.start = recordData.start;
        this.end = recordData.end;
        this.clientId = recordData.clientId;
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

  onUpdate(detailId, status, appointmentId) {
    this.appointmentService.updateStatus(
      detailId,
      status,
      appointmentId
    ).subscribe(() => {
      this.onClose();
      this.notificationService.success(':: Updated successfully');
      this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
