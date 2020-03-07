import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { HelpComponent } from '../help/help.component';
import { SettingComponent } from '../setting/setting.component';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout = new EventEmitter<boolean>();
  @Input() isAuthenticated: boolean;

  config: any;
  setting: any;
  userId: string;

  isAuth = true;
  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use(setting.language);
      this.setting = setting;
    });
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  onOpenDialog(type: string) {
    const dialogTitle = (type === 'help') ? 'Help' : 'Settings';
    const targetEl = (type === 'help') ? HelpComponent : SettingComponent;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      title: dialogTitle
    };
    this.dialog.open(targetEl, dialogConfig);
  }

  onLogout() {
    this.logout.emit(this.isAuth);
  }
}
