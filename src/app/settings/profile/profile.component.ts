import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { FormArray, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ImageComponent } from 'src/app/upload/image/image.component';
import { mimeType } from 'src/app/users/user-form/mime-type.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [`
  .addressGroup, .metaGroup {
    position: relative;
  }

  .addressGroup .action,
  .metaGroup .action {
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;
  }

  .addressGroup:hover .action,
  .metaGroup:hover .action {
    visibility: visible;
  }
  mat-form-field {
    width: 100%;
  }

  mat-form-field:not(:first-child) {
      margin-left: 1em;
  }
  form.normal-form {
    width: 50%;
  }
  .form-field-block {
      display: flex;
      flex-grow: 1;
      flex-direction: row;
      flex-basis: auto;
  }
  .image-preview {
    position: relative;
  }
  .image-preview button {
    position: absolute;
    right: 8px;
    visibility: hidden;
  }
  .image-preview:hover button {
    visibility: visible;
  }
  .image-preview img {
    width: 100%;
  }
  `]
})
export class ProfileComponent
extends SecureComponent
implements OnInit, OnDestroy {
  uId: string;
  selectedFile: File = null;
  imagePreview: string;
  userType: string;
  profileForm: FormGroup;
  isLoadingPic = false;
  bufferValue: number;
  color: string;
  mode: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public titleService: Title,
    public usersService: UsersService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    super(authService, router, dialog, appconfig);
  }

  async ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Settings - Profile');
    this.profileForm = new FormGroup({
      profilePicture: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

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

    this.usersService.get(this.userId).subscribe(userData => {
      this.isLoading = false;
      this.uId = userData.userId;
      this.imagePreview = userData.avatar;
      this.userType = userData.userType;

      this.form.patchValue({
        firstname: userData.firstname,
        midlename: userData.midlename,
        lastname: userData.lastname,
        contact: userData.contact,
        gender: userData.gender,
        birthdate: userData.birthdate,
        email: userData.email
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

  onUpdate() {
    if (this.form.invalid) {
      return;
    }

    this.usersService.update(
      this.uId,
      this.userType,
      this.form.value.firstname,
      this.form.value.midlename,
      this.form.value.lastname,
      this.form.value.contact,
      this.form.value.gender,
      this.form.value.birthdate,
      this.form.value.addresses,
      this.form.value.metas
    ).subscribe(() => {
      this.notificationService.success(':: Updated successfully');
    });

  }

  onImageSelect() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'Upload Image',
      dialogButton: 'Upload',
      patient: this.patientId
    };
    super.onPopup(args, ImageComponent);
  }

  onFileChanged(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    this.profileForm.patchValue({ profilePicture: this.selectedFile });
    this.isLoadingPic = true;
    this.onSavePicture();
  }

  onSavePicture() {
    this.usersService.upload(
      this.uId,
      this.userType,
      this.profileForm.value.profilePicture
    ).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.bufferValue = Math.round(event.loaded / event.total * 100);
        this.color = 'primary';
        this.mode = 'determinate';
      } else if (event.type === HttpEventType.Response) {
        this.isLoadingPic = false;
        this.imagePreview = event.body.imagePath;
        this.notificationService.success(':: ' + event.body.message);
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
