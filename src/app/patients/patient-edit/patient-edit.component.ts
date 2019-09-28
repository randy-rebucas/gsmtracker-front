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
import { UsersService } from 'src/app/users/users.service';

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
    private usersService: UsersService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef < PatientEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    super(authService, router, dialog, appconfig);

    this.Id = data.id;
    this.dialogTitle = data.title;
    this.btnLabel = data.button;
  }

  ngOnInit() {
    super.doInit();
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      midlename: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      email: [''],
      password: [''],
      addresses: this.fb.array([this.addAddressGroup()]),
      metas: this.fb.array([this.addMetaGroup()])
    });

    if (this.Id) {
        this.mode = 'edit';
        this.isLoading = true;
        this.usersService.get(this.Id).subscribe(userData => {
          this.isLoading = false;
          this.form.patchValue({
            firstname: userData.firstname,
            midlename: userData.midlename,
            lastname: userData.lastname,
            contact: userData.contact,
            gender: userData.gender,
            birthdate: userData.birthdate
          });
          const addressControl = this.form.controls.addresses as FormArray;
          const address = userData.addresses;
          for (let i = 1; i < address.length; i++) {
            addressControl.push(this.addAddressGroup());
          }
          this.form.patchValue({addresses: address});

          const metaControl = this.form.controls.metas as FormArray;
          const meta = userData.meta;
          for (let i = 1; i < meta.length; i++) {
            metaControl.push(this.addMetaGroup());
          }
          this.form.patchValue({metas: meta});

        });
      } else {
        this.isLoading = false;
        this.mode = 'create';
        this.Id = null;
      }
  }

  addAddressGroup() {
    return this.fb.group({
      current: [true],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  addMetaGroup() {
    return this.fb.group({
      label: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });
  }

  addAddress() {
    this.addressArray.push(this.addAddressGroup());
  }

  addMeta() {
    this.metaArray.push(this.addMetaGroup());
  }

  removeAddress(index) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  removeMeta(index) {
    this.metaArray.removeAt(index);
    this.metaArray.markAsDirty();
    this.metaArray.markAsTouched();
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  get metaArray() {
    return this.form.get('metas') as FormArray;
  }

  onSavePatient() {
    if (this.form.invalid) {
      return;
    }
    if (!this.Id) {
      this.usersService.insert(
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.addresses,
        this.form.value.metas,
        this.form.value.email,
        this.form.value.password,
        this.licenseId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.usersService.getAll('patient', this.licenseId, this.perPage, this.currentPage);
      });
    } else {
      this.usersService.update(
        this.Id,
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.addresses,
        this.form.value.metas
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.usersService.getAll('patient', this.licenseId, this.perPage, this.currentPage);
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
