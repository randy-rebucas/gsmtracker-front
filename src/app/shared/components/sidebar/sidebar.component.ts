import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { NotificationService } from '../../services/notification.service';
import { ProfileComponent } from '../profile/profile.component';
import { UploadService } from '../../services/upload.service';
import { LabelComponent } from '../label/label.component';
import { LabelsService } from '../../services/labels.service';
import { SettingsService } from '../../services/settings.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { ImportComponent } from '../import/import.component';
import { ExportComponent } from '../export/export.component';
import { PrintComponent } from '../print/print.component';
import { SelectionModel } from '@angular/cdk/collections';
import { RepairFormComponent } from 'src/app/modules/secure/repairs/repair-form/repair-form.component';

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
  fullname: string;
  email: string;
  userData: any;
  user: any;
  showLabel: boolean;
  labels: any[];
  labelsSub: Subscription;
  userSub: Subscription;

  isLoading: boolean;
  userId: string;
  setting: any;

  public selection = new SelectionModel<any>(true, []);
  selectedItem: any[];

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private appConfigurationService: AppConfigurationService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private labelsService: LabelsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router
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
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
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

    this.getData(this.userId).subscribe((resData) => {
      this.isLoading = false;
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      this.fullname = merge.name.firstname + ' ' + merge.name.lastname;
      this.imagePreview = merge.image;
    });
  }

  getData(userId: string): Observable<any> {
    return this.uploadService.get(userId);
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
    this.labelsService.delete(labelId).subscribe(() => {
      this.translate.get('common.deleted-message', {s: 'Label'})
      .subscribe((norifResMessgae: string) => {
        this.notificationService.success(norifResMessgae);
        this.labelsService.getAll(this.userId);
      });
    });
  }

  onDialogOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    // set modal attributes
    this.translate.get([
      'repairs.create-repairs',
      'common.submit'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        id: null,
        title: translate['repairs.create-repairs'],
        button: translate['common.submit']
      };
    });

    this.dialog.open(RepairFormComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.translate.get('common.created-message', {s: 'Repair'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });

        this.router.navigateByUrl('/secure/repairs/');
      }
    });
  }

  onImportOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.translate.get([
      'patients.import-patients'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['patients.import-patients']
      };
    });
    this.dialog.open(ImportComponent, dialogConfig);
  }

  onExportOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.translate.get([
      'repairs.export-repairs'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['repairs.export-repairs'],
        selectedItem: this.selectedItem
      };
    });
    this.dialog.open(ExportComponent, dialogConfig);
  }

  onPrintOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.translate.get([
      'repairs.print-repairs'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['repairs.print-repairs'],
        selectedItem: this.selectedItem
      };
    });
    this.dialog.open(PrintComponent, dialogConfig);
  }

  onFilterLabel(labelId: string) {
    this.labelsService.setSelectedLabel(labelId);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.labelsSub.unsubscribe();
  }
}
