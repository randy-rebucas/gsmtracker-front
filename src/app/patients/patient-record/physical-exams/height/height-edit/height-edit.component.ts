import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { HeightService } from '../../../services/height.service';
import { HeightData } from '../../../models/height-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-height-edit',
  templateUrl: './height-edit.component.html',
  styleUrls: ['./height-edit.component.css']
})
export class HeightEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  heightData: HeightData;
  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public heightService: HeightService,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < HeightEditComponent >,
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
      height: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.heightService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.heightData = {
              id: recordData._id,
              height: recordData.height,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              height: this.heightData.height,
              record_date: this.heightData.created
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
      this.heightService.insert(
        this.form.value.height,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.heightService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.heightService.update(
        this.recordId,
        this.form.value.height,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.heightService.getAll(this.perPage, this.currentPage, this.patientId);
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
