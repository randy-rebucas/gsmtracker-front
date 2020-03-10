import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { HelpComponent } from '../help/help.component';
import { SettingComponent } from '../setting/setting.component';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SettingsService } from '../../services/settings.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();
  @Output() logout = new EventEmitter<boolean>();
  @Input() isAuthenticated: boolean;

  setting: any;
  userId: string;

  isAuth = true;
  showBadge: boolean;
  isLoading: boolean;
  appTitle: string;
  appLang: string;
  constructor(
    private dialog: MatDialog,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private appConfigurationService: AppConfigurationService
  ) {
    this.userId = this.authenticationService.getUserId();
    this.showBadge = false;
    this.isLoading = true;
  }

  ngOnInit() {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.setting = setting;
      this.appTitle = this.setting ? this.setting.clinicname : this.appConfigurationService.title;
      this.appLang = this.setting ? this.setting.language : this.appConfigurationService.language;
      this.isLoading = false;
    });
  }

  onToggleSideBar() {
    this.toggleSideBar.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  onOpenDialog(type: string) {
    const targetEl = (type === 'help') ? HelpComponent : SettingComponent;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(targetEl, dialogConfig);
  }

  onLogout() {
    this.logout.emit(this.isAuth);
  }
}
