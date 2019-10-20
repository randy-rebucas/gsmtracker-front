import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { SettingsGeneralService } from '../settings-general.service';
import { Title } from '@angular/platform-browser';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { HttpEventType } from '@angular/common/http';
import { mimeType } from 'src/app/users/user-form/mime-type.validator';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styles: [`
  .arrayGroup {
    position: relative;
  }

  .arrayGroup .action {
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;
  }

  .arrayGroup:hover .action {
    visibility: visible;
  }
  mat-form-field {
    width: 100%;
  }

  mat-form-field:not(:first-child) {
      margin-left: 1em;
  }
  mat-form-field.time {
    width: 48%;
    flex-direction: row;
  }
  .form-field-block {
      display: flex;
      flex-grow: 1;
      flex-direction: row;
      flex-basis: auto;
  }
  .mat-form-field-flex .mat-form-field-infix ngx-material-timepicker-toggle button {
    position: absolute !important;
    right: 0;
    top: 0;
  }
  .action-button {
    position: absolute;
    right: 0;
    top: 0;
  }
  mat-form-field.contact {
    width: 48%;
  }

  .image-preview {
    position: relative;
    border: 2px solid transparent;
  }
  .image-preview:hover {
    border: 2px solid #dcdcdc;
  }
  .image-preview button {
    position: absolute;
    right: 0;
    visibility: hidden;
  }
  .image-preview:hover button {
    visibility: visible;
  }
  .image-preview img {
    width: 100%;
  }

  .rxpad-output {
    border: 1px solid #dcdcdc;
    min-height: 745px;
    -webkit-box-shadow: -10px 10px 54px 0px rgba(224,224,224,0.95);
    -moz-box-shadow: -10px 10px 54px 0px rgba(224,224,224,0.95);
    box-shadow: -10px 10px 54px 0px rgba(224,224,224,0.95);
}
  `]
})
export class ClinicComponent
extends SecureComponent
implements OnInit, OnDestroy {

  form: FormGroup;
  settingId: string;

  selectedFile: File = null;
  imagePreview: string;
  userType: string;
  logoForm: FormGroup;

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
    public settingsGeneralService: SettingsGeneralService,
    private notificationService: NotificationService,
    private fb: FormBuilder
    ) {
      super(authService, router, dialog, appconfig);

  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Settings - Clinic');
    this.logoForm = new FormGroup({
      logoPicture: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.form = this.fb.group({
      clinicName: ['', [Validators.required]],
      clinicOwner: ['', [Validators.required]],
      clinicEmail: [''],
      prc: [''],
      ptr: [''],
      s2: [''],
      nobreak: [''],
      addresses: this.fb.array([this.addAddressGroup()]),
      clinicPhone: this.fb.array([this.addClinicContactGroup()]),
      clinicHours: this.fb.array([this.addClinicHourGroup()])
    });


    this.populateForm();
  }

  populateForm() {
    this.settingsGeneralService.get(this.licenseId).subscribe(settingData => {
      this.isLoading = false;
      this.imagePreview = settingData.logoPath;
      this.form.patchValue({
        clinicName: settingData.clinicName,
        clinicOwner: settingData.clinicOwner,
        clinicEmail: settingData.clinicEmail,
        prc: settingData.prc,
        ptr: settingData.ptr,
        s2: settingData.s2,
        nobreak: settingData.nobreak
      });

      const addressControl = this.form.controls.addresses as FormArray;
      const address = settingData.address;
      for (let i = 1; i < address.length; i++) {
        addressControl.push(this.addAddressGroup());
      }
      this.form.patchValue({addresses: address});

      const contactControl = this.form.controls.clinicPhone as FormArray;
      const contacts = settingData.clinicPhone;
      for (let i = 1; i < contacts.length; i++) {
        contactControl.push(this.addClinicContactGroup());
      }
      this.form.patchValue({clinicPhone: contacts});

      const hourControl = this.form.controls.clinicHours as FormArray;
      const hours = settingData.clinicHours;
      for (let i = 1; i < hours.length; i++) {
        hourControl.push(this.addClinicHourGroup());
      }
      this.form.patchValue({clinicHours: hours});

      this.settingId = settingData._id;
    });
  }

  addAddressGroup() {
    return this.fb.group({
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morningOpen: [''],
      afternoonClose: ['']
    });
  }

  addClinicContactGroup() {
    return this.fb.group({
      contact: ['']
    });
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  get hourArray() {
    return this.form.get('clinicHours') as FormArray;
  }

  get contactArray() {
    return this.form.get('clinicPhone') as FormArray;
  }

  addHour() {
    this.hourArray.push(this.addClinicHourGroup());
  }

  addContact() {
    this.contactArray.push(this.addClinicContactGroup());
  }

  removeHour(index) {
    this.hourArray.removeAt(index);
    this.hourArray.markAsDirty();
    this.hourArray.markAsTouched();
  }

  removeContact(index) {
    this.contactArray.removeAt(index);
    this.contactArray.markAsDirty();
    this.contactArray.markAsTouched();
  }

  onSaveGenSetting() {
    this.settingsGeneralService.update(
      this.settingId,
      this.licenseId,
      this.form.value.clinicName,
      this.form.value.clinicOwner,
      this.form.value.addresses,
      this.form.value.clinicEmail,
      this.form.value.prc,
      this.form.value.ptr,
      this.form.value.s2,
      this.form.value.nobreak,
      this.form.value.clinicPhone,
      this.form.value.clinicHours
    ).subscribe(() => {
      this.notificationService.success('::Updated successfully');
    });
  }

  onFileChanged(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    this.logoForm.patchValue({ logoPicture: this.selectedFile });
    this.isLoadingPic = true;
    this.onSavePicture();
  }

  onSavePicture() {
    this.settingsGeneralService.upload(
      this.settingId,
      this.logoForm.value.logoPicture
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
