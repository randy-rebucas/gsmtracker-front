import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-result-edit',
  templateUrl: './test-result-edit.component.html',
  styleUrls: ['./test-result-edit.component.css']
})
export class TestResultEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  uploadData: UploadData;
  private mode = 'create';

  dialogTitle: string;
  dialogButton: string;

  id: string;
  created: string;
  path: string;
  name: string;
  type: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public uploadService: UploadService,
    public route: ActivatedRoute,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < TestResultEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);

      this.recordId = data.id;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.dialogButton = data.btnLabel;
    }

  ngOnInit() {
    super.doInit();
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(300) ]
      })
    });

    this.uploadService.getFile(this.recordId).subscribe(recordData => {
      this.isLoading = false;
      this.uploadData = {
        id: recordData._id,
        path: recordData.path,
        name: recordData.name,
        type: recordData.type,
        patientId: recordData.patientId,
        licenseId: recordData.licenseId,
        created: recordData.created
      };
      this.form.setValue({
        name: this.uploadData.name
      });
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.uploadService.update(
      this.recordId,
      this.form.value.name,
    ).subscribe(() => {
      this.onClose();
      this.notificationService.success(':: Updated successfully');
      this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);

    });

  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
