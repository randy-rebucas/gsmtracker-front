import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SecureComponent } from '../../secure.component';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss']
})
export class TechnicianComponent extends SecureComponent implements OnInit, AfterViewInit {
  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public settingsService: SettingsService,
    public uploadService: UploadService,
    public appConfigurationService: AppConfigurationService
  ) {
    super(
      authenticationService,
      translate,
      settingsService,
      uploadService,
      appConfigurationService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

}
