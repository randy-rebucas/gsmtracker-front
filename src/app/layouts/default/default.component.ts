import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;
  setting: any;
  userId: string;
  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private appConfigurationService: AppConfigurationService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {

    this.settingsService.get(this.userId).subscribe((setting) => {
      this.translate.use(setting ? setting.language : this.appConfigurationService.language);
      this.setting = setting;
    });
  }


  sideBarToggler(e) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  onLogout(isLogedOut: boolean): void {
    this.authenticationService.logout();
  }

}
