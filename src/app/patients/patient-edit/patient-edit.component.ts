import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { PatientsService } from '../patients.service';
import { PatientData } from '../patient-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  patient: PatientData;
  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    private patientsService: PatientsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef < PatientEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    super(authService, router, dialog, appconfig);

    this.patientId = data.id;
    this.dialogTitle = data.title;
    this.btnLabel = data.button;
  }

  ngOnInit() {
    super.doInit();
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      midlename: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      bloodType: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      comments: [''],
      email: [''],
      password: [''],
      addresses: this.fb.array([this.addAddressGroup()])
    });

    if (this.patientId) {
        this.mode = 'edit';
        this.isLoading = true;
        this.patientsService.get(this.patientId).subscribe(patientData => {
          this.isLoading = false;
          this.personId = patientData.personId;
          this.form.patchValue({
            bloodType: patientData.bloodType,
            comments: patientData.comments,
            firstname: patientData.firstname,
            midlename: patientData.midlename,
            lastname: patientData.lastname,
            contact: patientData.contact,
            gender: patientData.gender,
            birthdate: patientData.birthdate
          });
          const addressControl = this.form.controls.addresses as FormArray;
          const address = patientData.addresses;
          for (let i = 1; i < address.length; i++) {
            addressControl.push(this.addAddressGroup());
          }
          this.form.patchValue({addresses: address});

        });
      } else {
        this.isLoading = false;
        this.mode = 'create';
        this.patientId = null;
      }
  }

  addAddressGroup() {
    return this.fb.group({
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  addAddress() {
    this.addressArray.push(this.addAddressGroup());
  }

  removeAddress(index) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  onSavePatient() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.patientsService.insert(
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.bloodType,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.addresses,
        this.form.value.comments,
        this.form.value.email,
        this.form.value.password,
        this.userId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.patientsService.getAll(this.userId, this.perPage, this.currentPage);
      });
    } else {
      this.patientsService.update(
        this.patientId,
        this.personId,
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.bloodType,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.addresses,
        this.form.value.comments,
        this.form.value.email,
        this.form.value.password
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.patientsService.getAll(this.userId, this.perPage, this.currentPage);
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
