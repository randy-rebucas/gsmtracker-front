import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {

  private user: User;

  public form: FormGroup;
  public formId: string;
  public formTitle: string;
  public formButtontext: string;
  public userType: string;
  public isLoading: boolean;
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < PatientFormComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.formId = data.id;
    this.formTitle = data.title;
    this.formButtontext = data.button;
    this.userType = data.userType;

    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {

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

    if (this.formId) {
        this.isLoading = true;
        this.userService.get(this.formId).subscribe(userData => {
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
          const address = userData.address;
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
        this.formId = null;
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

  removeAddress(index: number) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  removeMeta(index: number) {
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

    const newPatient = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      midlename: this.form.value.midlename,
      gender: this.form.value.gender,
      birthdate: this.form.value.birthdate,
      contact: this.form.value.contact,
      current: this.form.value.current,
      address: this.form.value.addresses,
      email: this.form.value.email,
      password: this.form.value.password,
      meta: this.form.value.metas,
      typeId: this.userType,
      physician: this.authenticationService.getUserId()
    };

    const patientId = {
      id: this.formId,
    };

    const updatePatient = {
      ...newPatient, ...patientId
    };

    if (!this.formId) {
      this.userService.insert(newPatient).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.userService.getAll(this.userType, this.perPage, this.currentPage);
      });
    } else {
      this.userService.update(updatePatient).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.userService.getAll(this.userType, this.perPage, this.currentPage);
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

}
