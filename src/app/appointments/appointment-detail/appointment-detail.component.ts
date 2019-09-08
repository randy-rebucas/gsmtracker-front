import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AppointmentService } from '../../appointments/appointment.service';
import { AppointmentData } from '../../appointments/appointment-data.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit, OnDestroy {
  appointmentData: AppointmentData;
  isLoading = false;
  perPage = 10;
  currentPage = 1;
  userId: string;

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

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private appointmentId: string;

  constructor(
    public appointmentService: AppointmentService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < AppointmentDetailComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.appointmentId = data.id;
    }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;
    this.appointmentService.get(this.appointmentId)
      .subscribe(recordData => {
        this.isLoading = false;
        this.id = recordData._id;
        this.title = recordData.title;
        this.start = recordData.start;
        this.end = recordData.end;
        this.clientId = recordData.clientId;

        this.fullname = recordData.fullname;
        this.gender = recordData.gender;
        this.address = recordData.address;
        this.birthdate = recordData.birthdate;
        this.contact = recordData.contact;
        this.type = recordData.type;
        this.status = recordData.status;
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
    this.authListenerSubs.unsubscribe();
  }
}
