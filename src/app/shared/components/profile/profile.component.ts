import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from '../../services/user.service';

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
  public title: string;
  public userId: string;
  public user: any;
  public isLoading: boolean;
  public isChangePass: boolean;
  public isChangeEmail: boolean;
  public imagePath: any;
  public form: FormGroup;
  public formChangePass: FormGroup;
  public formChangeEmail: FormGroup;
  public startDate = new Date(1990, 0, 1);

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private uploadService: UploadService,
    private userService: UserService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < ProfileComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.userId = data.id;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.formChangePass = this.formBuilder.group({
      oldPass: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(10)
        ]
      }),
      newPass: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(10)
        ]
      })
    });

    this.formChangeEmail = this.formBuilder.group({
      oldPass: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(10)
        ]
      }),
      newEmail: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      })
    });

    this.form = this.formBuilder.group({
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
      addresses: this.formBuilder.array([this.addAddressGroup()]),
      bio: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(1500)
        ]
      })
    });

    this.getData(this.userId).subscribe((resData) => {
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      this.isLoading = false;
      console.log(merge);
      this.user = merge;
      this.form.patchValue({
        firstname: merge.name.firstname,
        midlename: merge.name.midlename,
        lastname: merge.name.lastname,
        birthdate: merge.birthdate,
        contact: merge.contact,
        gender: merge.gender,
        bio: merge.description
      });
      const addressControl = this.form.controls.addresses as FormArray;
      const address = merge.addresses;
      for (let i = 1; i < address.length; i++) {
        addressControl.push(this.addAddressGroup());
      }
      this.form.patchValue({addresses: address});
    });
  }

  getData(userId: any): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    return forkJoin([images, users]);
  }

  addAddressGroup() {
    return this.formBuilder.group({
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

  get passFormCtrls() {
    return this.formChangePass.controls;
  }

  get emailFormCtrls() {
    return this.formChangeEmail.controls;
  }

  getAddresseFormGroup(index: any): FormGroup {
    return this.addressArray.controls[index] as FormGroup;
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

    this.userService.update(updateUser).subscribe(() => {
      this.translate.get('common.updated-message', {s: 'Profile'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
    });
  }

  changeEmail() {
    this.isChangeEmail = !this.isChangeEmail;
  }

  onChangeEmail() {
    const updateEmail = {
      email: this.authenticationService.getUserEmail(),
      oldPass: this.formChangeEmail.value.oldPass,
      newEmail: this.formChangeEmail.value.newEmail,
      targetField: 'email'
    };
    this.authenticationService.update(updateEmail, this.userId).subscribe((res) => {
      this.translate.get('common.updated-message', {s: 'Email'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
      this.dialogRef.close();
      this.authenticationService.logout();
    });
  }

  changePass() {
    this.isChangePass = !this.isChangePass;
  }

  onChangePass() {
    const updatePass = {
      email: this.authenticationService.getUserEmail(),
      oldPass: this.formChangePass.value.oldPass,
      newPass: this.formChangePass.value.newPass,
      targetField: 'password'
    };
    this.authenticationService.update(updatePass, this.userId).subscribe((res) => {
      this.translate.get('common.updated-message', {s: 'Password'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
      this.dialogRef.close();
      this.authenticationService.logout();
    });
  }
}
