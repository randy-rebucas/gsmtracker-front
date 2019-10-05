import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FamilyHistoryService } from '../../../services/family-history.service';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 30%;
  }
  .mat-form-field {
    display: block;
  }
  `]
})
export class FamilyFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public familyHistoryService: FamilyHistoryService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );

    this.form = new FormGroup({
      familyHistory: new FormControl(null, {
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

    this.familyHistoryService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.familyHistory
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.familyHistoryService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
