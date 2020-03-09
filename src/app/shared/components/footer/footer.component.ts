import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  setting: any;
  userId: string;

  constructor(
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.setting = setting;
    });
  }

}
