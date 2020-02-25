import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { User } from 'src/app/modules/secure/user/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImportComponent } from '../import/import.component';
import { NotificationService } from '../../services/notification.service';
import { PatientFormComponent } from 'src/app/modules/secure/user/patients/patient-form/patient-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public perPage: number;
  public currentPage: number;

  email: string;
  user: User;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private patientsService: PatientsService
  ) {
    this.perPage = 10;
    this.currentPage = 1;
  }

  ngOnInit(): void {
    this.email = this.authenticationService.getUserEmail();
    this.userService.get(this.authenticationService.getUserId()).subscribe((user) => {
      this.user = user;
    });
  }

  onImportOpen() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //   title: 'Import patients'
    // };
    // this.dialog.open(ImportComponent, dialogConfig);
  }

  onDialogOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: null,
      title: 'Create New',
      button: 'Save'
    };
    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.success(':: Added successfully');
        this.router.navigateByUrl('/secure/users/patients/' + result + '/form');
        this.patientsService.getMyPatient(this.authenticationService.getUserId(), this.perPage, this.currentPage);
      }
    });
  }
}
