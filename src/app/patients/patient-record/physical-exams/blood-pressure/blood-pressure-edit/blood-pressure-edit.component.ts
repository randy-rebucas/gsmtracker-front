import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { BpService } from '../../../services/bp.service';
import { BpData } from '../../../models/bp-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-blood-pressure-edit',
  templateUrl: './blood-pressure-edit.component.html',
  styleUrls: ['./blood-pressure-edit.component.css']
})
export class BloodPressureEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  bpData: BpData;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public bpService: BpService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < BloodPressureEditComponent >,
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
        systolic: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      diastolic: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.bpService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.bpData = {
              id: recordData._id,
              systolic: recordData.systolic,
              diastolic: recordData.diastolic,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
                systolic: this.bpData.systolic,
                diastolic: this.bpData.diastolic,
              record_date: this.bpData.created
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
      this.bpService.insert(
        this.form.value.systolic,
        this.form.value.diastolic,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.bpService.update(
        this.recordId,
        this.form.value.systolic,
        this.form.value.diastolic,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
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
