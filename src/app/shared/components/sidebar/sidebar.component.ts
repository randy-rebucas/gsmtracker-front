import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { User } from 'src/app/modules/secure/user/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImportComponent } from '../import/import.component';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  email: string;
  user: User;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.email = this.authenticationService.getUserEmail();
    this.userService.get(this.authenticationService.getUserId()).subscribe((user) => {
      this.user = user;
    });
  }

  onImportOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Import patients'
    };
    this.dialog.open(ImportComponent, dialogConfig);
  }

}
