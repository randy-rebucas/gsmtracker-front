import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSelectChange } from '@angular/material/select';

import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { SettingsService } from '../../services/settings.service';
import { UploadService } from '../../services/upload.service';
import { CountriesService } from '../../services/countries.service';

import { Settings } from '../../interfaces/settings';
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
  public form: FormGroup;
  public setting: Settings;
  public imagePath: any;
  public innerTranslate: string;
  public countries: any[] = [];
  public currencies: Currency[] = [
    {value: 'PHP', viewValue: 'PHP'},
    {value: 'USD', viewValue: 'USD'},
    {value: 'SAR', viewValue: 'SR'}
  ];
  private userId: string;
  private subs = new SubSink();

  constructor(
    public dialogRef: MatDialogRef<SettingComponent>,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private appConfigurationService: AppConfigurationService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private country: CountriesService,
    private formBuilder: FormBuilder
  ) {
    translate.setDefaultLang(appConfigurationService.language); // default language
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.subs.sink = this.translate.get('settings.title').subscribe((translate: string) => {
        this.innerTranslate = translate;
    });

    const newCountries = [];
    this.subs.sink = this.country.allCountries().
    subscribe((countries) => {
      for (const key in countries) {
          if (Object.prototype.hasOwnProperty.call(countries, key)) {
            const element = countries[key];
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
    this.form = this.formBuilder.group({
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
    .subscribe((settingResponse) => {

      this.setting = settingResponse;
      this.translate.use((settingResponse) ? settingResponse.language : this.appConfigurationService.language);

      if (settingResponse) {
        this.uploadService.get(settingResponse?._id).subscribe((res) => {
          this.imagePath = res.image;
        });
      }

      this.form.patchValue({
        shopname: (settingResponse) ? settingResponse.shopName : this.appConfigurationService.title,
        shopowner: (settingResponse) ? settingResponse.shopOwner : this.appConfigurationService.owner,
        language: (settingResponse) ? settingResponse.language : this.appConfigurationService.language,
        currency: (settingResponse) ? settingResponse.currency : this.appConfigurationService.currency,
        country: (settingResponse) ? settingResponse.country : this.appConfigurationService.country,
        updates:  (settingResponse) ? settingResponse.updates : true
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
