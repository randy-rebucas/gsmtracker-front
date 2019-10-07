import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { PrescriptionService } from '../services/prescription.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styles: [`
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card-title {
    margin-bottom: unset !important;
    font-size: 14px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  .form-field-block {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    flex-basis: auto;
  }
  mat-form-field {
    width: 100%;
    margin-right: 1em;
  }
  .action-btn {
    position: absolute;
    right: 15px;
  }
  .mat-form-field-wrapper {
    position: relative;
    margin-right: 15px;
  }
  mat-form-field.record-date {
    width: 25%;
  }
  button.mat-menu-trigger {
    position: absolute;
    right: 0;
    top: 5px;
  }
  `]
})
export class PrescriptionsComponent
extends SecureComponent
implements OnInit, OnDestroy {
  panelOpenState = true;
  listOpenState = true;
  allergyFormOpenState = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private fb: FormBuilder,
    public prescriptionService: PrescriptionService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.userId;
      }
    );
    this.form = this.fb.group({
      record_date: [new Date(), [Validators.required]],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });
  }

  onOpenForm() {
    this.panelOpenState = ! this.panelOpenState;
  }

  onOpenAllergyForm() {
    this.allergyFormOpenState = ! this.allergyFormOpenState;
  }

  onOpenList() {
    this.listOpenState = ! this.listOpenState;
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
    this.prescriptionService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.prescriptions
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
