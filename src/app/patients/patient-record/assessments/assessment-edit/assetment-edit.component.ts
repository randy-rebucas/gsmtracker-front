import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentData } from '../../models/assessment-data.model';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-assessment-edit',
  templateUrl: './assetment-edit.component.html',
  styleUrls: ['./assetment-edit.component.css']
})
export class AssessmentEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  assessmentId: string;
  diagnosis: [];
  treatments: [];

  assessmentData: AssessmentData;

  private mode = 'create';

  complaintId: string;
  dialogTitle: string;
  dialogButton: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public assessmentService: AssessmentService,
    public complaintService: ComplaintService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < AssessmentEditComponent >,
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
        diagnosis: this.fb.array([this.addDiagnosisGroup()]),
        treatments: this.fb.array([this.addTreatmentsGroup()])
      });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.assessmentService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;

            const diagnosisControl = this.form.controls.diagnosis as FormArray;
            const diagnosisArray = recordData.diagnosis;
            for (let i = 1; i < diagnosisArray.length; i++) {
              diagnosisControl.push(this.addDiagnosisGroup());
            }
            this.form.patchValue({diagnosis: diagnosisArray});

            const treatmentsControl = this.form.controls.treatments as FormArray;
            const treatmentsArray = recordData.treatments;
            for (let i = 1; i < treatmentsArray.length; i++) {
              treatmentsControl.push(this.addTreatmentsGroup());
            }
            this.form.patchValue({treatments: treatmentsArray});
          });
        } else {
          this.mode = 'create';
          this.recordId = null;
          this.isLoading = false;
        }
  }

  addDiagnosisGroup() {
    return this.fb.group({
      diagnose: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  addTreatmentsGroup() {
    return this.fb.group({
      treatment: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  addDiagnose() {
    this.diagnosisArray.push(this.addDiagnosisGroup());
  }

  addTreatment() {
    this.treatmentsArray.push(this.addTreatmentsGroup());
  }

  removeDiagnose(index) {
    this.diagnosisArray.removeAt(index);
    this.diagnosisArray.markAsDirty();
    this.diagnosisArray.markAsTouched();
  }

  removeTreatment(index) {
    this.treatmentsArray.removeAt(index);
    this.treatmentsArray.markAsDirty();
    this.treatmentsArray.markAsTouched();
  }

  get diagnosisArray() {
    return this.form.get('diagnosis') as FormArray;
  }

  get treatmentsArray() {
    return this.form.get('treatments') as FormArray;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.assessmentService.insert(
        this.form.value.record_date,
        this.complaintId,
        this.patientId,
        this.form.value.diagnosis,
        this.form.value.treatments
      ).subscribe(() => {

        this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);

        this.onClose();
        this.notificationService.success(':: Added successfully');
      });
    } else {
      this.assessmentService.update(
        this.recordId,
        this.form.value.record_date,
        this.complaintId,
        this.patientId,
        this.form.value.diagnosis,
        this.form.value.treatments
      ).subscribe(() => {
        this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
        this.onClose();
        this.notificationService.success(':: Updated successfully');
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
