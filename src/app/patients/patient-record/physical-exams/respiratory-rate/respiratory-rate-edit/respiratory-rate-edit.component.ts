import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { RprService } from '../../../services/rpr.service';
import { RprData } from '../../../models/rpr-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-respiratory-rate-edit',
  templateUrl: './respiratory-rate-edit.component.html',
  styleUrls: ['./respiratory-rate-edit.component.css']
})
export class RespiratoryRateEditComponent
extends SecureComponent
implements OnInit, OnDestroy {
  rprData: RprData;

  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public rprService: RprService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < RespiratoryRateEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog);
      this.recordId = data.id;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.btnLabel = data.button;
    }

  ngOnInit() {
    super.doInit();

    this.form = new FormGroup({
      respiratoryrate: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.rprService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.rprData = {
              id: recordData._id,
              respiratoryrate: recordData.respiratoryrate,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              respiratoryrate: this.rprData.respiratoryrate,
              record_date: this.rprData.created
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
      this.rprService.insert(
        this.form.value.respiratoryrate,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.rprService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.rprService.update(
        this.recordId,
        this.form.value.respiratoryrate,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.rprService.getAll(this.perPage, this.currentPage, this.patientId);
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
