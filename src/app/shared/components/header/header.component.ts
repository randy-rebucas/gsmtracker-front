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
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();
  @Output() logout = new EventEmitter<boolean>();
  @Input() isAuthenticated: boolean;

  setting: any;
  userId: string;

  isAuth = true;
  showBadge: boolean;
  isLoading: boolean;
  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService
  ) {
    this.userId = this.authenticationService.getUserId();
    this.showBadge = false;
    this.isLoading = true;
  }

  ngOnInit() {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use(setting.language);
      this.setting = setting;
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
