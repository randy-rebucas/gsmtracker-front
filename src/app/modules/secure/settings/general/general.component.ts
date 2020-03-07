import { Component, OnInit } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { SettingsService, Setting } from '../settings.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { map } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Settings } from '../settings';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';


export interface Practices {
  value: string;
  viewValue: string;
}
interface TimeSet {
  value: string;
  viewValue: string;
}
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
  public practice: string;
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

  times = [];
  user: User;
  setting: Settings;
  isShowHeader: boolean;
  constructor(
    private titleService: Title,
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    private userService: UserService,
    public appConfigurationService: AppConfigurationService
  ) {
    this.isLoading = false;
    // this.settingId = null;
    console.log(this.appConfigurationService.title);
  }

  ngOnInit() {
    this.titleService.setTitle('Settings - General');

    const quarterHours = ['00', '15', '30', '45'];

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        // Using slice() with negative index => You get always (the last) two digit numbers.
        this.times.push( ('0' + i).slice(-2) + ':' + quarterHours[j] );
      }
    }

    this.userId = this.authenticationService.getUserId();
    this.userService.get(this.userId).pipe(
      map(userData => {
        const userId = {
          id: userData._id,
        };
        return {...userId, ...userData};
      })
    ).subscribe((user) => {
      this.user = user;
    });

    this.form = this.fb.group({
      // rxpad header setting
      rxHeaderOption: [''],
      rxFooterOption: [''],
      prescription: this.fb.group({
        rxTitle: new FormControl('', [Validators.maxLength(150)]),
        rxSubTitle: new FormControl('', [Validators.maxLength(150)]),
        rxNoNoonBreak: new FormControl(''),
        rxAddresses: this.fb.array([this.addAddressGroup()]),
        rxPhones: this.fb.array([this.addClinicContactGroup()]),
        rxHours: this.fb.array([this.addClinicHourGroup()]),
      }),
      // language
      language: [''],
      // appointments
      appointments: [''],
      // updates
      updates: ['']
    });
    this.settingsService.get(this.userId)
    .pipe(
      map(settingData => {
        if (settingData) {
          const settingId = {
            id: settingData._id,
          };
          return {...settingId, ...settingData};
        }
        return null;
      })
    )
    .subscribe((setting) => {
      console.log(setting);
    //     this.settingId = settingData.settingId;
    //     this.uploadService.get(this.settingId).subscribe((res) => {
    //       this.imagePath = res.image;
    //     });
      if (!setting) {
        console.log('all empty');
        this.form.patchValue({
          language: 'en',
        });
      }
      if (setting) {
        this.form.patchValue({
          rxHeaderOption: setting.rxHeaderOption,
          rxFooterOption: setting.rxFooterOption,
          appointments: setting.appointments,
          prescription: setting.prescription,
          language: setting.language,
          updates: setting.updates
        });

        const addressControl = this.form.controls.addresses as FormArray;
        const address = (setting.prescription.length) ? setting.prescription[0].addresses : [];
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});

        const contactControl = this.form.controls.phones as FormArray;
        const contacts = (setting.prescription.length) ? setting.prescription[0].phones : [];
        for (let i = 1; i < contacts.length; i++) {
          contactControl.push(this.addClinicContactGroup());
        }
        this.form.patchValue({phones: contacts});

        const timesControl = this.form.controls.hours as FormArray;
        const times = (setting.prescription.length) ? setting.prescription[0].hours : [];
        for (let i = 1; i < times.length; i++) {
          timesControl.push(this.addClinicHourGroup());
        }
        this.form.patchValue({hours: times});
      }

      if ((setting)) {
        this.isShowHeader = (setting) ? setting.rxHeaderOption : false;
      }
    });
  }

  onToggleHeader(event: MatSlideToggleChange) {
    this.isShowHeader = event.checked;
    console.log(event.checked);
  }

  addAddressGroup() {
    return this.fb.group({
      address1: [null],
      address2: null,
      city: [null],
      province: [null],
      postalCode: [null, Validators.compose([
        Validators.minLength(5), Validators.maxLength(5)])
      ],
      country: [null]
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
    return this.form.get('prescription.rxAddresses') as FormArray;
  }

  get hourArray() {
    return this.form.get('prescription.rxHours') as FormArray;
  }

  get contactArray() {
    return this.form.get('prescription.rxPhones') as FormArray;
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
      userId: this.user.id,
      // rxpad
      rxHeaderOption: this.form.value.rxHeaderOption,
      rxFooterOption: this.form.value.rxFooterOption,
      prescription: this.form.value.prescription,
      // language
      language: this.form.value.language,
      // appointments
      appointments: this.form.value.appointments,
      // updates
      updates: this.form.value.updates
    };

    this.settingsService.setSetting(updatedSetting).subscribe((res) => {
      this.settingsService.getSetting(this.user.id);
      this.notificationService.success(res.message);
    });
  }
}
