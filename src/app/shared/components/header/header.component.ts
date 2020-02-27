import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { HelpComponent } from '../help/help.component';
import { SettingComponent } from '../setting/setting.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth = true;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout = new EventEmitter<boolean>();

  @Input() isAuthenticated: boolean;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  onOpenHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      title: 'Help'
    };
    this.dialog.open(HelpComponent, dialogConfig);
  }

  onLogout() {
    // Output the value
    this.logout.emit(this.isAuth);
  }
}
