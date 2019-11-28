import { Component, OnInit } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../settings.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  public form: FormGroup;
  public settingId: string;
  public imagePath: any;

  public isLoading: boolean;
  public name: string;
  public owner: string;
  public email: string;
  public prc: number;
  public ptr: number;
  public s2: number;
  public nobreak: boolean;
  public address1: string;
  public address2: string;
  public city: string;
  public province: string;
  public postalcode: string;
  public country: string;
  public phone: string;
  public morning: string;
  public afternoon: string;
  imagePreview: string;

  private userId: string;

  constructor(
    private titleService: Title,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private uploadService: UploadService
  ) {
    this.isLoading = false;
    // this.settingId = null;
  }

  ngOnInit() {
    this.titleService.setTitle('Settings - General');
    this.userId = this.authenticationService.getUserId();

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      email: [''],
      prc: ['', [Validators.required]],
      ptr: [''],
      s2: [''],
      nobreak: [''],
      addresses: this.fb.array([this.addAddressGroup()]),
      phones: this.fb.array([this.addClinicContactGroup()]),
      hours: this.fb.array([this.addClinicHourGroup()])
    });

    this.settingsService.getSetting(this.userId)
    .subscribe(settingData => {

      this.isLoading = false;

      if (settingData) {
        const general = settingData.general;

        this.settingId = settingData.settingId;
        this.uploadService.get(this.settingId).subscribe((res) => {
          this.imagePath = res.image;
        });

        this.name = (general.length) ? general[0].name : null;
        this.owner = (general.length) ? general[0].owner : null;
        this.email = (general.length) ? general[0].email : null;
        this.prc = (general.length) ? general[0].prc : null;
        this.ptr = (general.length) ? general[0].ptr : null;
        this.s2 = (general.length) ? general[0].s2 : null;
        this.nobreak = (general.length) ? general[0].nobreak : null;

        this.form.patchValue({
          name: this.name,
          owner: this.owner,
          email: this.email,
          prc: this.prc,
          ptr: this.ptr,
          s2: this.s2,
          nobreak: this.nobreak
        });

        const addressControl = this.form.controls.addresses as FormArray;
        const address = (general.length) ? general[0].addresses : [];
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});

        const contactControl = this.form.controls.phones as FormArray;
        const contacts = (general.length) ? general[0].phones : [];
        for (let i = 1; i < contacts.length; i++) {
          contactControl.push(this.addClinicContactGroup());
        }
        this.form.patchValue({phones: contacts});

        const timesControl = this.form.controls.hours as FormArray;
        const times = (general.length) ? general[0].hours : [];
        for (let i = 1; i < times.length; i++) {
          timesControl.push(this.addClinicHourGroup());
        }
        this.form.patchValue({hours: times});
      }

    });
  }

  addAddressGroup() {
    return this.fb.group({
      address1: [null, [Validators.required]],
      address2: null,
      city: [null, [Validators.required]],
      province: [null, [Validators.required]],
      postalCode: [null, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(5)])
      ],
      country: [null, [Validators.required]]
    });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morningOpen: [null],
      afternoonClose: [null]
    });
  }

  addClinicContactGroup() {
    return this.fb.group({
      contact: [null]
    });
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  get hourArray() {
    return this.form.get('hours') as FormArray;
  }

  get contactArray() {
    return this.form.get('phones') as FormArray;
  }

  addHour() {
    this.hourArray.push(this.addClinicHourGroup());
  }

  addContact() {
    this.contactArray.push(this.addClinicContactGroup());
  }

  removeHour(index: number) {
    this.hourArray.removeAt(index);
    this.hourArray.markAsDirty();
    this.hourArray.markAsTouched();
  }

  removeContact(index: number) {
    this.contactArray.removeAt(index);
    this.contactArray.markAsDirty();
    this.contactArray.markAsTouched();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const updatedSetting = {
      id: this.settingId,
      userId: this.userId,
      name: this.form.value.name,
      owner: this.form.value.owner,
      addresses: this.form.value.addresses,
      email: this.form.value.email,
      prc: this.form.value.prc,
      ptr: this.form.value.ptr,
      s2: this.form.value.s2,
      nobreak: this.form.value.nobreak,
      phones: this.form.value.phones,
      hours: this.form.value.hours
    };

    this.settingsService.updateGeneral(updatedSetting).subscribe((general) => {
      this.notificationService.success(general.message);
    });

  }
}
