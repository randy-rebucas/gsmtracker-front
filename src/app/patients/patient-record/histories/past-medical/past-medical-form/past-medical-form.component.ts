import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FamilyHistoryService } from '../../../services/family-history.service';
import { PastMedicalService } from '../../../services/past-medical.service';

@Component({
  selector: 'app-past-medical-form',
  templateUrl: './past-medical-form.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 30%;
  }
  .mat-form-field {
    display: block;
  }
  `]
})
export class PastMedicalFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public pastMedicalService: PastMedicalService,
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
      pastMedical: new FormControl(null, {
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

    this.pastMedicalService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.pastMedical
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.pastMedicalService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
