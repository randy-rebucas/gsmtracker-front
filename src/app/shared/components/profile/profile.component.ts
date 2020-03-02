import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { forkJoin, Observable } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
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
      addresses: this.fb.array([this.addAddressGroup()])
    });

    this.getData(this.userId).subscribe((resData) => {
      const merge = {...resData[0], ...resData[1]};
      console.log(merge);
      this.isLoading = false;
      this.user = merge;
      this.form.patchValue({
        firstname: merge.name.firstname,
        midlename: merge.name.midlename,
        lastname: merge.name.lastname,
        birthdate: merge.birthdate,
        contact: merge.contact,
        gender: merge.gender
      });
      const addressControl = this.form.controls.addresses as FormArray;
      const address = merge.addresses;
      for (let i = 1; i < address.length; i++) {
        addressControl.push(this.addAddressGroup());
      }
      this.form.patchValue({addresses: address});
    });
  }

  getData(userId): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    return forkJoin([images, users]);
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

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

    const updatePatient = {
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

    this.userService.update(updatePatient).subscribe(() => {
      this.notificationService.success(':: Updated successfully');
      this.dialogRef.close();
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
