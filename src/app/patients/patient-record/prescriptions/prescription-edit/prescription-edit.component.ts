import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionData } from '../../models/prescription-data.model';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-prescription-edit',
  templateUrl: './prescription-edit.component.html',
  styleUrls: ['./prescription-edit.component.css']
})
export class PrescriptionEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  prescriptionData: PrescriptionData;

  private mode = 'create';

  dialogTitle: string;
  dialogButton: string;
  complaintId: string;

  checked = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public complaintService: ComplaintService,
    public prescriptionService: PrescriptionService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < PrescriptionEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);

      this.recordId = data.id;
      this.complaintId = data.complaintIds;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.dialogButton = data.btnLabel;
    }

  ngOnInit() {
    super.doInit();

    this.form = this.fb.group({
      record_date: [new Date(), [Validators.required]],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.prescriptionService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;

            this.form.patchValue({
              record_date: recordData.created
            });
            const prescriptionControl = this.form.controls.prescriptions as FormArray;
            const prescription = recordData.prescriptions;
            for (let i = 1; i < prescription.length; i++) {
              prescriptionControl.push(this.addPrescriptionGroup());
            }
            this.form.patchValue({prescriptions: prescription});

          });
        } else {
          this.mode = 'create';
          this.recordId = null;
          this.isLoading = false;
        }
  }

  addPrescriptionGroup() {
    return this.fb.group({
      maintenableFlg: [],
      medicine: ['', [Validators.required]],
      preparation: [''],
      sig: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
  }

  addPrescription() {
    this.prescriptionArray.push(this.addPrescriptionGroup());
  }

  removePrescription(index) {
    this.prescriptionArray.removeAt(index);
    this.prescriptionArray.markAsDirty();
    this.prescriptionArray.markAsTouched();
  }

  get prescriptionArray() {
    return this.form.get('prescriptions') as FormArray;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.prescriptionService.insert(
        this.form.value.record_date,
        this.patientId,
        this.form.value.prescriptions
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.complaintService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.prescriptionService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
      });
    } else {
      this.prescriptionService.update(
        this.recordId,
        this.form.value.record_date,
        this.patientId,
        this.form.value.prescriptions
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
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
