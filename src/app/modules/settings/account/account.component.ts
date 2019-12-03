import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserService } from '../../user/user.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public userId: string;
  public email: string;

  public firstname: string;
  public lastname: string;
  public midlename: string;
  public birthdate: string;
  public contact: string;
  public gender: string;
  public createdAt: Date;
  public updatedAt: Date;
  public address: any[];
  public metas: any[];

  public publicKey: string;
  public privateKey: string;

  public imagePath: any;
  public form: FormGroup;
  public startDate = new Date(1990, 0, 1);

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      midlename: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      addresses: this.fb.array([this.addAddressGroup()]),
      metas: this.fb.array([this.addMetaGroup()])
    });

    this.userId = this.authenticationService.getUserId();
    this.email = this.authenticationService.getUserEmail();

    this.uploadService.get(this.userId).subscribe((res) => {
      this.imagePath = res.image;
    });

    this.userService.get(this.userId).subscribe((user) => {

      this.firstname = user.firstname;
      this.midlename = user.midlename;
      this.lastname = user.lastname;
      this.birthdate = user.birthdate;
      this.contact = user.contact;
      this.gender = user.gender;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.address = user.address;
      this.metas = user.metas;

      this.publicKey = user.publicKey;
      this.privateKey = user.privateKey;

      this.form.patchValue({
        firstname: user.firstname,
        midlename: user.midlename,
        lastname: user.lastname,
        birthdate: user.birthdate,
        contact: user.contact,
        gender: user.gender
      });
      const addressControl = this.form.controls.addresses as FormArray;
      const address = user.address;
      for (let i = 1; i < address.length; i++) {
        addressControl.push(this.addAddressGroup());
      }
      this.form.patchValue({addresses: address});

      const metaControl = this.form.controls.metas as FormArray;
      const meta = user.metas;
      for (let i = 1; i < meta.length; i++) {
        metaControl.push(this.addMetaGroup());
      }
      this.form.patchValue({metas: meta});

    });
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

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

    const updatePatient = {
      id: this.userId,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      midlename: this.form.value.midlename,
      gender: this.form.value.gender,
      birthdate: this.form.value.birthdate,
      contact: this.form.value.contact,
      address: this.form.value.addresses,
      meta: this.form.value.metas,
    };

    this.userService.updateProfile(updatePatient).subscribe(() => {
      this.notificationService.success(':: Updated successfully');
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
