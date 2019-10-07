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
import { mimeType } from 'src/app/patients/patient-edit/mime-type.validator';
import { HttpEventType } from '@angular/common/http';

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
  form.normal-form {
    width: 50%;
    margin: 3em 0;
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
    border: 2px solid #dcdcdc;
    padding: .5em;
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
export class ClinicComponent
extends SecureComponent
implements OnInit, OnDestroy {

  form: FormGroup;
  settingId: string;

  selectedFile: File = null;
  imagePreview: string;
  userType: string;
  logoForm: FormGroup;

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
      this.form = this.fb.group({
        clinicName: ['', [Validators.required]],
        clinicOwner: ['', [Validators.required]],
        clinicAddress: [''],
        clinicEmail: [''],
        prc: [''],
        ptr: [''],
        s2: [''],
        nobreak: [''],
        clinicPhone: this.fb.array([this.addClinicContactGroup()]),
        clinicHours: this.fb.array([this.addClinicHourGroup()])
      });

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

    this.populateForm();
  }

  populateForm() {
    this.settingsGeneralService.get(this.licenseId).subscribe(settingData => {
      this.imagePreview = settingData.logoPath;

      this.form.patchValue({
        clinicName: settingData.clinicName,
        clinicOwner: settingData.clinicOwner,
        clinicAddress: settingData.clinicAddress,
        clinicEmail: settingData.clinicEmail,
        prc: settingData.prc,
        ptr: settingData.ptr,
        s2: settingData.s2,
        nobreak: settingData.nobreak
      });

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
      this.form.value.clinicAddress,
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
    this.logoForm.get('logoPicture').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
    this.onSavePicture();
  }

  onSavePicture() {
    this.settingsGeneralService.upload(
      this.settingId,
      this.logoForm.value.logoPicture
    ).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('upload progress: ' + Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event); // handle event here
      }
      this.notificationService.success(':: settings logo updated successfully');
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
