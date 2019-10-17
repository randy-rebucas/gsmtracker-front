import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-chief-complaint-edit',
  templateUrl: './chief-complaint-edit.component.html',
  styleUrls: ['./chief-complaint-edit.component.css']
})
export class ChiefComplaintEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public complaintService: ComplaintService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.parent.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.userId;
      }
    );

    this.form = new FormGroup({
      complaint: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.complaintService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.complaint
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
      // redirect histories
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
