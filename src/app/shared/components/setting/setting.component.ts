import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { Settings } from '../../interfaces/settings';
import { SettingsService } from '../../services/settings.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, AfterContentInit {
  selected: string;

  public form: FormGroup;
  times = [];
  setting: Settings;
  imagePath: any;
  private userId: string;

  constructor(
    public dialogRef: MatDialogRef<SettingComponent>,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private appConfigurationService: AppConfigurationService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {
    translate.setDefaultLang(appConfigurationService.language); // default language
  }

  ngOnInit(): void {
    const quarterHours = ['00', '15', '30', '45'];

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        // Using slice() with negative index => You get always (the last) two digit numbers.
        this.times.push( ('0' + i).slice(-2) + ':' + quarterHours[j] );
      }
    }

    this.userId = this.authenticationService.getUserId();

  }

  ngAfterContentInit() {
    this.form = this.fb.group({
      shopname: new FormControl(null),
      shopowner:  new FormControl(null),
      // language
      language: new FormControl(null),
      // appointments
      appointments: new FormControl(null),
      // updates
      updates: new FormControl(null)
    });

    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.setting = setting;
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);

      if (setting) {
        this.uploadService.get(setting?._id).subscribe((res) => {
          this.imagePath = res.image;
        });
      }

      this.form.patchValue({
        shopname: (setting) ? setting.shopname : this.appConfigurationService.title,
        shopowner: (setting) ? setting.shopowner : this.appConfigurationService.owner,
        appointments:  (setting) ? setting.appointments : true,
        language: (setting) ? setting.language : this.appConfigurationService.language,
        updates:  (setting) ? setting.updates : true
      });

    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const updatedSetting = {
      userId:  this.userId,
      clinicname: this.form.value.clinicname,
      clinicowner: this.form.value.clinicowner,
      // language
      language: this.form.value.language,
      // appointments
      appointments: this.form.value.appointments,
      // updates
      updates: this.form.value.updates
    };

    this.settingsService.setSetting(updatedSetting).subscribe((res) => {
      this.settingsService.getSetting(this.userId);
      this.notificationService.success(res.message);
      this.dialogRef.close();
    });

  }
}
