import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  setting: any;
  userId: string;

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use(setting.language);
      this.setting = setting;
    });
  }

}
