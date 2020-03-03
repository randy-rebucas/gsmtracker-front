import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { forkJoin, Observable } from 'rxjs';
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
      firstname: ['', [Validators.required]],
      midlename: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      addresses: this.fb.array([this.addAddressGroup()]),
      bio: ['', [Validators.required]],
      practices: this.fb.array([this.practicesGroup()]),
      prc: ['', [Validators.required]],
      ptr: [''],
      s2: [''],
      professionalFee: ['', [Validators.required]]
    });

    this.getData(this.userId).subscribe((resData) => {
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      console.log(merge);
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

  getData(userId): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    const physicians = this.physiciansService.get(userId);
    return forkJoin([images, users, physicians]);
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

  practicesGroup() {
    return this.fb.group({
      practice: ['', [Validators.required]],
      practiceYearExperience: ['', [Validators.required]]
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

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

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

    this.userService.update(updateUser).subscribe(() => {
      this.notificationService.success(':: Updated successfully');
      const updatePhysician = {
        _id: this.user._id,
        practices: this.form.value.practices,
        description: this.form.value.bio,
        prc: this.form.value.prc,
        ptr: this.form.value.ptr,
        s2: this.form.value.s2,
        professionalFee: this.form.value.professionalFee
      };
      this.physiciansService.update(updatePhysician).subscribe(() => {
        this.dialogRef.close();
      });
    });

  }

  onCopy(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.notificationService.success(':: Copied');
  }

  onChangeEmail() {

  }

  onChangePass() {

  }
}
