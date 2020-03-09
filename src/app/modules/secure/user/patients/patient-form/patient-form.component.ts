import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthenticationService } from '../../../../authentication/authentication.service';
import { UserService } from '../../user.service';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {

  public form: FormGroup;
  public formId: string;
  public formTitle: string;
  public formButtontext: string;

  public isLoading: boolean;
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  public startDate = new Date(1990, 0, 1);

  constructor(
    private userService: UserService,
    private patientsService: PatientsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < PatientFormComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.formId = data.id;
    this.formTitle = data.title;
    this.formButtontext = data.button;

    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {

    this.form = this.fb.group({
      userId: new FormControl(null),
      firstname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      midlename: new FormControl(null, {
        validators: [
          Validators.maxLength(30)
        ]
      }),
      lastname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      contact: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(11)
        ]
      }),
      gender: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      birthdate: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      addresses: this.fb.array([this.addAddressGroup()])
    });

    if (this.formId) {
        this.isLoading = true;
        this.patientsService.get(this.formId).subscribe(userData => {
          this.isLoading = false;
          this.form.patchValue({
            firstname: userData.userId.name.firstname,
            midlename: userData.userId.name.midlename,
            lastname: userData.userId.name.lastname,
            contact: userData.userId.contact,
            gender: userData.userId.gender,
            birthdate: userData.userId.birthdate,
            userId: userData.userId._id
          });
          const addressControl = this.form.controls.addresses as FormArray;
          const address = userData.userId.addresses;
          for (let i = 1; i < address.length; i++) {
            addressControl.push(this.addAddressGroup());
          }
          this.form.patchValue({addresses: address});
        });
      } else {
        this.isLoading = false;
        this.formId = null;
      }
  }

  addAddressGroup() {
    return this.fb.group({
      current: new FormControl(true),
      address1: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      }),
      address2: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      }),
      city: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }),
      province: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }),
      postalCode: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6)
        ]
      }),
      country: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  addAddress() {
    this.addressArray.push(this.addAddressGroup());
  }

  removeAddress(index: number) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  get formCtrls() {
    return this.form.controls;
  }

  getAddresseFormGroup(index: any): FormGroup {
    return this.addressArray.controls[index] as FormGroup;
  }

  onSavePatient() {
    if (this.form.invalid) {
      return;
    }

    const newUser = {
      name: {
        firstname: this.form.value.firstname,
        midlename: this.form.value.midlename,
        lastname: this.form.value.lastname
      },
      gender: this.form.value.gender,
      birthdate: this.form.value.birthdate,
      contact: this.form.value.contact,
      current: this.form.value.current,
      addresses: this.form.value.addresses
    };

    const userId = {
      _id: this.form.value.userId,
    };

    const updatePatient = {
      ...newUser, ...userId
    };

    if (!this.formId) {
      this.userService.insert(newUser).subscribe((res) => {
        // set patient data
        const newpatient = {
          userId: res.id,
          physician: this.authenticationService.getUserId()
        };
        this.patientsService.insert(newpatient).subscribe((response) => {
          this.onClose(response.patientId);
        });
      });
    } else {
      this.userService.update(updatePatient).subscribe(() => {
        this.onClose('update');
      });
    }
  }

  onClose(state?: string) {
    this.form.reset();
    this.dialogRef.close(state);
  }

}
