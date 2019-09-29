import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PresentIllnessService } from '../../../services/present-illness.service';

@Component({
  selector: 'app-present-illness-form',
  templateUrl: './present-illness-form.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 30%;
  }
  .mat-form-field {
    display: block;
  }
  `]
})
export class PresentIllnessFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private presentIllnessService: PresentIllnessService
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );

    this.form = new FormGroup({
      presentIllness: new FormControl(null, {
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

    this.presentIllnessService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.presentIllness
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.presentIllnessService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
