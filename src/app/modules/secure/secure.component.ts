import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { Settings } from 'src/app/shared/interfaces/settings';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SubSink } from 'subsink';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit, OnDestroy, AfterViewInit {
  userId: string;
  imagePath: any;
  setting: Settings;
  private subs = new SubSink();
  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public settingsService: SettingsService,
    public uploadService: UploadService,
    public appConfigurationService: AppConfigurationService,
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    console.log('Secure ngOnInit');
    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use('de');
      this.setting = setting;

      if (setting) {
        this.uploadService.get(setting?._id).subscribe((res) => {
          this.imagePath = res.image;
        });
      }
    });
  }

  ngAfterViewInit() {
    console.log('Secure ngAfterViewInit');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
