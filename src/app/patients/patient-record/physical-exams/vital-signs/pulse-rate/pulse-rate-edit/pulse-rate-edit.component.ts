import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { PrService } from '../../../../services/pr.service';
import { PrData } from '../../../../models/pr.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-pulse-rate-edit',
  templateUrl: './pulse-rate-edit.component.html',
  styles: [`
  mat-form-field {
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
  `]
})
export class PulseRateEditComponent
extends SecureComponent
implements OnInit, OnDestroy {
  prData: PrData;

  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public prService: PrService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < PulseRateEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.recordId = data.id;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.btnLabel = data.button;
    }

  ngOnInit() {
    super.doInit();

    this.form = new FormGroup({
      pulserate: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.prService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.prData = {
              id: recordData._id,
              pulserate: recordData.pulserate,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              pulserate: this.prData.pulserate,
              record_date: this.prData.created
            });
          });
        } else {
          this.isLoading = false;
          this.mode = 'create';
          this.recordId = null;
        }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.prService.insert(
        this.form.value.pulserate,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.prService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.prService.update(
        this.recordId,
        this.form.value.pulserate,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.prService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
