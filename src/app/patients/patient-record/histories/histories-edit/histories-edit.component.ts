import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { HistoryService } from '../../services/history.service';
import { HistoryData } from '../../models/history-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';

export interface Types {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-histories-edit',
  templateUrl: './histories-edit.component.html',
  styleUrls: ['./histories-edit.component.css']
})
export class HistoriesEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  historyData: HistoryData;
  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  types: Types[] = [
    {value: 'Allergies', viewValue: 'Allergies'},
    {value: 'Drug', viewValue: 'Drug'},
    {value: 'Social', viewValue: 'Social'},
    {value: 'Family', viewValue: 'Family'},
    {value: 'Surgical', viewValue: 'Surgical'},
    {value: 'Obstetric', viewValue: 'Obstetric'},
    {value: 'Developmental', viewValue: 'Developmental'}
  ];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public historyService: HistoryService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < HistoriesEditComponent >,
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
      type: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(150) ]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(150) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.historyService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.historyData = {
              id: recordData._id,
              type: recordData.type,
              description: recordData.description,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              type: this.historyData.type,
              description: this.historyData.description,
              record_date: this.historyData.created
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
      this.historyService.insert(
        this.form.value.type,
        this.form.value.description,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.historyService.update(
        this.recordId,
        this.form.value.type,
        this.form.value.description,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
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
