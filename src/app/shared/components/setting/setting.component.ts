import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { User } from 'src/app/modules/secure/user/user';
import { Settings } from 'src/app/modules/secure/settings/settings';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { map } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  selected: string;

  public form: FormGroup;
  times = [];
  user: User;
  setting: Settings;
  isShowHeader: boolean;
  private userId: string;

  constructor(
    public dialogRef: MatDialogRef<SettingComponent>,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private appConfigurationService: AppConfigurationService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    translate.setDefaultLang(appConfigurationService.language); // default language
  }

  ngOnInit(): void {
    this.selected = this.appConfigurationService.language;
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
      rxHeaderOption: new FormControl(null),
      rxFooterOption: new FormControl(null),
      prescription: this.fb.group({
        rxTitle: new FormControl(null, [Validators.maxLength(150)]),
        rxSubTitle: new FormControl(null, [Validators.maxLength(150)]),
        rxNoNoonBreak: new FormControl(null),
        rxAddresses: this.fb.array([this.addAddressGroup()]),
        rxPhones: this.fb.array([this.addClinicContactGroup()]),
        rxHours: this.fb.array([this.addClinicHourGroup()]),
      }),
      clinicname: new FormControl(null),
      // language
      language: new FormControl(null),
      // appointments
      appointments: new FormControl(null),
      // updates
      updates: new FormControl(null)
    });
    // this.settingsService.get(this.userId)
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      console.log(setting);
      this.translate.use(setting.language);
    //     this.settingId = settingData.settingId;
    //     this.uploadService.get(this.settingId).subscribe((res) => {
    //       this.imagePath = res.image;
    //     });

      if (setting) {
        this.form.patchValue({
          clinicname: setting.clinicname,
          rxHeaderOption: setting.rxHeaderOption,
          rxFooterOption: setting.rxFooterOption,
          appointments: setting.appointments,
          prescription: setting.prescription,
          language: setting.language,
          updates: setting.updates
        });

        const addressControl = this.form.controls.addresses as FormArray;
        const address = (setting.prescription) ? setting.prescription.rxAddresses : [];
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});

        const contactControl = this.form.controls.phones as FormArray;
        const contacts = (setting.prescription) ? setting.prescription.rxPhones : [];
        for (let i = 1; i < contacts.length; i++) {
          contactControl.push(this.addClinicContactGroup());
        }
        this.form.patchValue({phones: contacts});

        const timesControl = this.form.controls.hours as FormArray;
        const times = (setting.prescription) ? setting.prescription.rxHours : [];
        for (let i = 1; i < times.length; i++) {
          timesControl.push(this.addClinicHourGroup());
        }
        this.form.patchValue({hours: times});
      }

      this.isShowHeader = (setting) ? setting.rxHeaderOption : false;
    });
  }

  onToggleHeader(event: MatSlideToggleChange) {
    this.isShowHeader = event.checked;
  }

  addAddressGroup() {
    return this.fb.group({
      address1: new FormControl(null),
      address2: new FormControl(null),
      city: new FormControl(null),
      province: new FormControl(null),
      postalCode: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5)
        ]
      }),
      country: new FormControl(null)
    });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morningOpen: new FormControl(null),
      afternoonClose: new FormControl(null)
    });
  }

  addClinicContactGroup() {
    return this.fb.group({
      contact: new FormControl(null)
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
      clinicname: this.form.value.clinicname,
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
      this.dialogRef.close();
    });

  }
}
