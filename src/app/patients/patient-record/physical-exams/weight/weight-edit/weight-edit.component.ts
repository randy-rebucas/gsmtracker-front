import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { WeightService } from '../../../services/weight.service';
import { WeightData } from '../../../models/weight-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-weight-edit',
  templateUrl: './weight-edit.component.html',
  styleUrls: ['./weight-edit.component.css']
})
export class WeightEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  weightData: WeightData;

  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public weightService: WeightService,
    public route: ActivatedRoute,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < WeightEditComponent >,
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
      weight: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.weightService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.weightData = {
              id: recordData._id,
              weight: recordData.weight,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              weight: this.weightData.weight,
              record_date: this.weightData.created
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
      this.weightService.insert(
        this.form.value.weight,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.weightService.update(
        this.recordId,
        this.form.value.weight,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
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
