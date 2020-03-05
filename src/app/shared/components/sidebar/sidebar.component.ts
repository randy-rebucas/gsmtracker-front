import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { PatientFormComponent } from 'src/app/modules/secure/user/patients/patient-form/patient-form.component';
import { Router } from '@angular/router';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';
import { ProfileComponent } from '../profile/profile.component';
import { UploadService } from '../../services/upload.service';
import { switchMap } from 'rxjs/operators';
import { LabelComponent } from '../label/label.component';
import { LabelsService } from '../../services/labels.service';
import { Subscription } from 'rxjs';

export interface Label {
  label: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public perPage: number;
  public currentPage: number;
  public imagePath: any;
  defaultImage: any;
  email: string;
  userData: any;
  user: any;
  showLabel: boolean;
  labels: any[];
  labelsSub: Subscription;

  isLoading: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    private userService: UserService,
    private uploadService: UploadService,
    private labelsService: LabelsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private patientsService: PatientsService
  ) {
    this.perPage = 10;
    this.currentPage = 1;
    this.defaultImage = './../../../../assets/images/blank.png';
    this.isLoading = true;
  }

  ngOnInit(): void {

    this.labelsService.getAll(this.authenticationService.getUserId());
    this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.email = this.authenticationService.getUserEmail();
    this.userService.get(this.authenticationService.getUserId())
    .pipe(
      switchMap((userData) => {
        this.userData = userData;
        return this.uploadService.get(userData._id);
      })
    )
    .subscribe((transformedUser) => {
      this.isLoading = false;
      this.user = { ...this.userData, ...transformedUser};
    });
  }

  onOpenProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      title: 'Profile',
      id: this.authenticationService.getUserId()
    };
    this.dialog.open(ProfileComponent, dialogConfig);
  }

  onToogleLabel() {
    this.showLabel = !this.showLabel;
  }

  onCreateLabel(labelId?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: (labelId) ? 'Update label' : 'Create label',
      id: labelId
    };
    this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        const msg = (result === 'update') ? ':: Updated successfully' : ':: Added successfully';
        this.notificationService.success(msg);
        this.labelsService.getAll(this.authenticationService.getUserId());
      }
    });
  }

  onDeleteLabel(labelId?: string) {
    this.labelsService.delete(labelId).subscribe((res) => {
      this.notificationService.success(res.message);
      this.labelsService.getAll(this.authenticationService.getUserId());
    });
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

  onImportOpen() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //   title: 'Import patients'
    // };
    // this.dialog.open(ImportComponent, dialogConfig);
  }

  onFilterLabel(labelId: string) {
    this.labelsService.setSelectedLabel(labelId);
  }

  ngOnDestroy() {
    this.labelsSub.unsubscribe();
  }
}
