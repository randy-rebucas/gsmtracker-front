import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';

import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { Settings } from '../../interfaces/settings';
import { SettingsService } from '../../services/settings.service';
import { UploadService } from '../../services/upload.service';
import { CountriesService } from '../../services/countries.service';
import { SubSink } from 'subsink';

interface Currency {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy, AfterContentInit {
  selected: string;

  public form: FormGroup;
  times = [];
  setting: Settings;
  imagePath: any;
  private userId: string;
  private subs = new SubSink();
  currencies: Currency[] = [
    {value: 'PHP', viewValue: 'PHP'},
    {value: 'USD', viewValue: 'USD'},
    {value: 'SAR', viewValue: 'SR'}
  ];
  states: any[] = [];
  countries: any[] = [];
  cities: any[] = [];

  selectedCountry: any;
  public innerTranslate: string;
  constructor(
    public dialogRef: MatDialogRef<SettingComponent>,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private appConfigurationService: AppConfigurationService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private country: CountriesService,
    private fb: FormBuilder
  ) {
    translate.setDefaultLang(appConfigurationService.language); // default language
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.subs.sink = this.translate.get([
      'settings.title'
    ]).subscribe((translate: string) => {
        this.innerTranslate = translate['settings.title'];
      }
    );
    this.getCountries();
  }

  getCountries() {
    const newCountries = [];
    this.subs.sink = this.country.allCountries().
    subscribe((countries) => {
      for (const key in countries) {
          if (Object.prototype.hasOwnProperty.call(countries, key)) {
            const element = countries[key];
            // console.log(element);
            newCountries.push({value: element.name, viewValue: element.name});
          }
        }
      this.countries = newCountries;
      }
    );
  }

  selectCountry(event: MatSelectChange) {
    this.formCtrls.country.setValue(event.value);
  }

  selectCurrency(event: MatSelectChange) {
    this.formCtrls.currency.setValue(event.value);
  }

  ngAfterContentInit() {
    this.form = this.fb.group({
      shopname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(150)
        ]
      }),
      shopowner:  new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(150)
        ]
      }),
      language: new FormControl(null),
      currency: new FormControl(null),
      country: new FormControl(null),
      updates: new FormControl(null)
    });

    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.setting = setting;
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);

      if (setting) {
        this.uploadService.get(setting?._id).subscribe((res) => {
          this.imagePath = res.image;
        });
      }

      this.form.patchValue({
        shopname: (setting) ? setting.shopName : this.appConfigurationService.title,
        shopowner: (setting) ? setting.shopOwner : this.appConfigurationService.owner,
        language: (setting) ? setting.language : this.appConfigurationService.language,
        currency: (setting) ? setting.currency : this.appConfigurationService.currency,
        country: (setting) ? setting.country : this.appConfigurationService.country,
        updates:  (setting) ? setting.updates : true
      });

    });
  }

  get formCtrls() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const updatedSetting = {
      userId:  this.userId,
      shopName: this.form.value.shopname,
      shopOwner: this.form.value.shopowner,
      language: this.form.value.language,
      currency: this.form.value.currency,
      country: this.form.value.country,
      updates: this.form.value.updates
    };

    this.subs.sink = this.settingsService.setSetting(updatedSetting).subscribe(() => {
      this.subs.sink = this.translate.get('common.updated-message', {s: this.innerTranslate }
      ).subscribe((norifResMessgae: string) => {
        this.notificationService.success(norifResMessgae);
        this.settingsService.getSetting(this.userId);
        this.dialogRef.close();
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
