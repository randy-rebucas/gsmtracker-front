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
    public settingsService: SettingsService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private domSanitizer: DomSanitizer
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
      prc: [''],
      ptr: [''],
      s2: [''],
      nobreak: [''],
      addresses: this.fb.array([this.addAddressGroup()]),
      phones: this.fb.array([this.addClinicContactGroup()]),
      hours: this.fb.array([this.addClinicHourGroup()])
    });

    this.settingsService.getOwnSetting(this.userId)
    .subscribe(settingData => {

      this.isLoading = false;
      if (settingData) {
        this.settingId = settingData._id;
        this.uploadService.get(this.settingId).subscribe((res) => {
          this.imagePath = res.image;
        });

        this.name = settingData.name;
        this.owner = settingData.owner;
        this.email = settingData.email;
        this.prc = settingData.prc;
        this.ptr = settingData.ptr;
        this.s2 = settingData.s2;
        this.nobreak = settingData.nobreak;

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
        const address = settingData.addresses;
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});

        const contactControl = this.form.controls.phones as FormArray;
        const contacts = settingData.phones;
        for (let i = 1; i < contacts.length; i++) {
          contactControl.push(this.addClinicContactGroup());
        }
        this.form.patchValue({phones: contacts});

        const timesControl = this.form.controls.hours as FormArray;
        const times = settingData.hours;
        for (let i = 1; i < times.length; i++) {
          timesControl.push(this.addClinicHourGroup());
        }
        this.form.patchValue({hours: times});
      }

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

    const newSetting = {
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

    const idSetting = {
      id: this.settingId
    };

    const updatedSetting = {
      ...newSetting, ...idSetting
    };

    if (this.settingId) {
        this.settingsService.update(updatedSetting).subscribe(() => {
          this.notificationService.success('::Updated successfully');
        });
    } else {
        this.settingsService.insert(newSetting).subscribe(() => {
          this.notificationService.success(':: Updated successfully');
        });
    }
  }
}
