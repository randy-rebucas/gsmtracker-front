import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-qr-writer',
  templateUrl: './qr-writer.component.html',
  styleUrls: ['./qr-writer.component.scss']
})
export class QrWriterComponent implements OnInit {
  title: string;
  id: string;
  setting: any;
  userId: string;
  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef < QrWriterComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.id = data.id;
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

  onDownload() {

  }

  onShare() {

  }
}
