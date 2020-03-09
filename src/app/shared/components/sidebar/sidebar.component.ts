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
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/modules/secure/settings/settings.service';

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
  imagePreview: any;
  email: string;
  userData: any;
  user: any;
  showLabel: boolean;
  labels: any[];
  labelsSub: Subscription;

  isLoading: boolean;
  userId: string;
  setting: any;

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
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
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use(setting.language);
      this.setting = setting;
    });

    this.labelsService.getAll(this.userId);
    this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.uploadService.getProfilePicture().subscribe((image) => {
      this.imagePreview = image;
    });

    this.email = this.authenticationService.getUserEmail();
    this.userService.get(this.userId)
    .pipe(
      switchMap((userData) => {
        this.userData = userData;
        return this.uploadService.get(userData._id);
      })
    )
    .subscribe((transformedUser) => {
      this.isLoading = false;
      this.user = { ...this.userData, ...transformedUser};
      this.imagePreview = this.user.image;
    });
  }

  onOpenProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    // set modal attribute
    this.translate.get('common.profile').subscribe((language) => {
      dialogConfig.data = {
        title: language,
        id: this.userId
      };
    });

    this.dialog.open(ProfileComponent, dialogConfig);
  }

  onToogleLabel() {
    this.showLabel = !this.showLabel;
  }

  onCreateLabel(labelId?: string) {
    let modalTitle = '';
    let modalBtn = '';
    this.translate.get((labelId) ? 'labels.update-labels' : 'labels.create-labels').subscribe((res: string) => {
      modalTitle = res;
    });
    this.translate.get((labelId) ? 'common.update' : 'common.submit').subscribe((res: string) => {
      modalBtn = res;
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: modalTitle,
      btn: modalBtn,
      id: labelId
    };
    this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        let norifResMessgae = '';
        this.translate.get(
          (result === 'update') ? 'common.updated-message' : 'common.created-message',
          {s: 'Label'}
        ).subscribe((res: string) => {
          norifResMessgae = res;
        });
        this.notificationService.success(norifResMessgae);
        this.labelsService.getAll(this.userId);
      }
    });
  }

  onDeleteLabel(labelId?: string) {
    this.labelsService.delete(labelId).subscribe((response) => {
      let norifResMessgae = '';
      this.translate.get('common.deleted-message',
        {s: 'Label'}
      ).subscribe((res: string) => {
        norifResMessgae = res;
      });
      this.notificationService.success(norifResMessgae);
      this.labelsService.getAll(this.userId);
    });
  }

  onDialogOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    // set modal attributes
    this.translate.get([
      'patients.create-patients',
      'common.submit'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        id: null,
        title: translate['patients.create-patients'],
        button: translate['common.submit']
      };
    });

    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.translate.get('common.created-message', {s: 'Patient'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });

        this.router.navigateByUrl('/secure/users/patients/' + result + '/form');
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
