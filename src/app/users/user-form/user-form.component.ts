import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';

import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { UserData } from '../user-data.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  user: UserData;
  dialogTitle: string;
  btnLabel: string;
  userType: string;
  types: any[];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef < UserFormComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    super(authService, router, dialog, appconfig);

    this.Id = data.id;
    this.dialogTitle = data.title;
    this.btnLabel = data.button;
    this.userType = data.userType;
  }

  ngOnInit() {
    super.doInit();
    console.log(this.userType);
    this.types = [{
      id: '8f8c6e98',
      name: 'Physician',
      description: 'USD'
     },
     {
      id: '169fee1a',
      name: 'Patient',
      description: 'CAD'
     }];

    this.form = this.fb.group({
      usertype: [this.userType ? this.userType : '', [Validators.required]],
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
            usertype: this.userType,
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
          const meta = userData.metas;
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
      current: [],
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
      label: [''],
      value: ['']
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
        (this.userType) ? this.userType : this.form.value.usertype,
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.addresses,
        this.form.value.metas,
        this.form.value.email,
        this.form.value.password
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.usersService.getAll(this.userType, this.perPage, this.currentPage);
      });
    } else {
      this.usersService.update(
        this.Id,
        (this.userType) ? this.userType : this.form.value.usertype,
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
        this.usersService.getAll(this.userType, this.perPage, this.currentPage);
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
