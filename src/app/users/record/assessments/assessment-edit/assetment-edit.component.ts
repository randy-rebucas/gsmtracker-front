import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentData } from '../../models/assessment-data.model';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-assessment-edit',
  templateUrl: './assetment-edit.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 30%;
  }
  .mat-form-field {
    display: block;
  }
  .action-button button {
    margin-left: 8px;
    text-align: right;
  }
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card-title {
    margin-bottom: unset !important;
    font-size: 14px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  button.mat-menu-trigger {
    position: absolute;
    right: 0;
    top: 5px;
  }
  `]
})
export class AssessmentEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public assessmentService: AssessmentService,
    public complaintService: ComplaintService,
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
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
      diagnosis: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500) ]
      }),
      treatments: new FormControl(null, {
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

    this.assessmentService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.diagnosis,
      this.form.value.treatments
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
