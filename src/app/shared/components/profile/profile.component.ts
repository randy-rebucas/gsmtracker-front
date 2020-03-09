import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { PhysiciansService } from 'src/app/modules/secure/user/physicians/physicians.service';

export interface Practices {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title: string;
  userId: string;
  user: any;
  isLoading: boolean;
  public imagePath: any;
  public form: FormGroup;
  public startDate = new Date(1990, 0, 1);

  practices: Practices[] = [
    {value: 'ALLERGY & IMMUNOLOGY', viewValue: 'ALLERGY & IMMUNOLOGY'},
    {value: 'ANESTHESIOLOGY', viewValue: 'ANESTHESIOLOGY'},
    {value: 'DERMATOLOGY', viewValue: 'DERMATOLOGY'},
    {value: 'DIAGNOSTIC RADIOLOGY', viewValue: 'DIAGNOSTIC RADIOLOGY'},
    {value: 'EMERGENCY MEDICINE', viewValue: 'EMERGENCY MEDICINE'},
    {value: 'FAMILY MEDICINE', viewValue: 'FAMILY MEDICINE'},
    {value: 'INTERNAL MEDICINE', viewValue: 'INTERNAL MEDICINE'},
    {value: 'MEDICAL GENETICS', viewValue: 'MEDICAL GENETICS'},
    {value: 'NEUROLOGY', viewValue: 'NEUROLOGY'},
    {value: 'NUCLEAR MEDICINE', viewValue: 'NUCLEAR MEDICINE'},
    {value: 'OBSTETRICS AND GYNECOLOGY', viewValue: 'OBSTETRICS AND GYNECOLOGY'},
    {value: 'PATHOLOGY', viewValue: 'PATHOLOGY'},
    {value: 'PEDIATRICS', viewValue: 'PEDIATRICS'},
    {value: 'PHYSICAL MEDICINE & REHABILITATION', viewValue: 'PHYSICAL MEDICINE & REHABILITATION'},
    {value: 'PREVENTIVE MEDICINE', viewValue: 'PREVENTIVE MEDICINE'},
    {value: 'PSYCHIATRY', viewValue: 'PSYCHIATRY'},
    {value: 'RADIATION ONCOLOGY', viewValue: 'RADIATION ONCOLOGY'},
    {value: 'SURGERY', viewValue: 'SURGERY'},
    {value: 'UROLOGY', viewValue: 'UROLOGY'}
  ];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userService: UserService,
    private physiciansService: PhysiciansService,
    private uploadService: UploadService,
    private notificationService: NotificationService,
    public authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef < ProfileComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.userId = data.id;
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.form = this.fb.group({
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
      addresses: this.fb.array([this.addAddressGroup()]),
      bio: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(1500)
        ]
      }),
      practices: this.fb.array([this.practicesGroup()]),
      prc: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(15)
        ]
      }),
      ptr: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(15)
        ]
      }),
      s2: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(10)
        ]
      }),
      professionalFee: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6)
        ]
      }),
    });

    this.getData(this.userId).subscribe((resData) => {
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      this.isLoading = false;
      this.user = merge;
      this.form.patchValue({
        firstname: merge.name.firstname,
        midlename: merge.name.midlename,
        lastname: merge.name.lastname,
        birthdate: merge.birthdate,
        contact: merge.contact,
        gender: merge.gender,
        bio: merge.description,
        prc: merge.prc,
        ptr: merge.ptr,
        s2: merge.s2,
        professionalFee: merge.professionalFee
      });
      const addressControl = this.form.controls.addresses as FormArray;
      const address = merge.addresses;
      for (let i = 1; i < address.length; i++) {
        addressControl.push(this.addAddressGroup());
      }
      this.form.patchValue({addresses: address});

      const practiceControl = this.form.controls.practices as FormArray;
      const practice = merge.practices;
      for (let i = 1; i < practice.length; i++) {
        practiceControl.push(this.practicesGroup());
      }
      this.form.patchValue({practices: practice});
    });
  }

  getData(userId: any): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    const physicians = this.physiciansService.get(userId);
    return forkJoin([images, users, physicians]);
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

  practicesGroup() {
    return this.fb.group({
      practice: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      practiceYearExperience: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(2)
        ]
      })
    });
  }

  addAddress() {
    this.addressArray.push(this.addAddressGroup());
  }

  addParactice() {
    this.practiceArray.push(this.practicesGroup());
  }

  removeAddress(index: number) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  removePractice(index: number) {
    this.practiceArray.removeAt(index);
    this.practiceArray.markAsDirty();
    this.practiceArray.markAsTouched();
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  get practiceArray() {
    return this.form.get('practices') as FormArray;
  }

  get formCtrls() {
    return this.form.controls;
  }

  getAddresseFormGroup(index: any): FormGroup {
    return this.addressArray.controls[index] as FormGroup;
  }

  getPractiseFormGroup(index: any): FormGroup {
    return this.practiceArray.controls[index] as FormGroup;
  }

  onSubmit() {
    // check if form is valid
    if (this.form.invalid) {
      return;
    }
    // user data
    const updateUser = {
      _id: this.userId,
      name: {
        firstname: this.form.value.firstname,
        lastname: this.form.value.lastname,
        midlename: this.form.value.midlename
      },
      gender: this.form.value.gender,
      birthdate: this.form.value.birthdate,
      contact: this.form.value.contact,
      addresses: this.form.value.addresses
    };

    this.userService.update(updateUser).subscribe((userResponse) => {
      // physician data
      const updatePhysician = {
        _id: this.user._id,
        practices: this.form.value.practices,
        description: this.form.value.bio,
        prc: this.form.value.prc,
        ptr: this.form.value.ptr,
        s2: this.form.value.s2,
        professionalFee: this.form.value.professionalFee
      };
      this.physiciansService.update(updatePhysician).subscribe((physicianResponse) => {
        // set user subscription
        this.userService.setSubListener({...userResponse, ...physicianResponse});
        // response message
        this.translate.get('common.updated-message', {s: 'Physician'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        // close dialog
        this.dialogRef.close();
      });
    });

  }

  onCopy(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    // response message
    this.translate.get('common.copied')
    .subscribe((norifResMessgae: string) => {
      this.notificationService.success(norifResMessgae);
    });
  }

  onChangeEmail() {

  }

  onChangePass() {

  }
}
