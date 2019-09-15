import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { SettingsGeneralService } from '../settings-general.service';
import { Title } from '@angular/platform-browser';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.css']
})
export class SettingsGeneralComponent
extends SecureComponent
implements OnInit, OnDestroy {

  form: FormGroup;
  settingId: string;

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
        clinicUrl: [''],
        clinicEmail: [''],
        prc: [''],
        ptr: [''],
        s2: [''],
        clinicPhone: this.fb.array([this.addClinicContactGroup()]),
        clinicHours: this.fb.array([this.addClinicHourGroup()])
      });

  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Settings - General');

    this.populateForm();
  }

  populateForm() {
    this.settingsGeneralService.get(this.userId).subscribe(settingData => {
      this.form.patchValue({
        clinicName: settingData[0].clinicName,
        clinicOwner: settingData[0].clinicOwner,
        clinicAddress: settingData[0].clinicAddress,
        clinicUrl: settingData[0].clinicUrl,
        clinicEmail: settingData[0].clinicEmail,
        prc: settingData[0].prc,
        ptr: settingData[0].ptr,
        s2: settingData[0].s2,
      });

      const contactControl = this.form.controls.clinicPhone as FormArray;
      const contacts = settingData[0].clinicPhone;
      for (let i = 1; i < contacts.length; i++) {
        contactControl.push(this.addClinicContactGroup());
      }
      this.form.patchValue({clinicPhone: contacts});

      const hourControl = this.form.controls.clinicHours as FormArray;
      const hours = settingData[0].clinicHours;
      for (let i = 1; i < hours.length; i++) {
        hourControl.push(this.addClinicHourGroup());
      }
      this.form.patchValue({clinicHours: hours});

      this.settingId = settingData[0]._id;
    });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morningOpen: [''],
      morningClose: [''],
      afternoonOpen: [''],
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
      this.form.value.clinicName,
      this.form.value.clinicOwner,
      this.form.value.clinicAddress,
      this.form.value.clinicEmail,
      this.form.value.clinicUrl,
      this.form.value.prc,
      this.form.value.ptr,
      this.form.value.s2,
      this.form.value.clinicPhone,
      this.form.value.clinicHours
    ).subscribe(() => {
      this.notificationService.success('::Updated successfully');
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
