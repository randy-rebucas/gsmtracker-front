import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { RepairsService } from 'src/app/modules/secure/repairs/repairs.service';
import { Settings } from '../../interfaces/settings';
import { SubSink } from 'subsink';

export interface Label {
  label: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy {
  public perPage: number;
  public currentPage: number;
  public imagePath: any;
  public defaultImage: any;
  public imagePreview: any;
  public fullname: string;
  public email: string;
  public userData: any;
  public user: any;
  public showLabel: boolean;
  public labels: any[];
  public isLoading: boolean;

  public setting: Settings;
  public selection = new SelectionModel<any>(true, []);
  public selectedItem: any[];
  public importTitle: string;
  public exportTitle: string;
  public printTitle: string;
  public profileTitle: string;
  public dialogLabelTitle: string;
  public dialogLabelButton: string;
  public innerLabelTransalate: string;

  private userId: string;
  private subs = new SubSink();
  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private appConfigurationService: AppConfigurationService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private repairsService: RepairsService,
    private labelsService: LabelsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService,
  ) {
    this.perPage = 10;
    this.currentPage = 1;
    this.defaultImage = './../../../../assets/images/blank.png';
    this.isLoading = true;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.translate.get([
      'repairs.import-repairs',
      'repairs.export-repairs',
      'repairs.print-repairs',
      'common.profile',
      'labels.title'
    ]).subscribe((translate) => {
      this.importTitle = translate['repairs.import-repairs'];
      this.exportTitle = translate['repairs.export-repairs'];
      this.printTitle = translate['repairs.print-repairs'];
      this.profileTitle = translate['common.profile'];
      this.innerLabelTransalate = translate['labels.title'];
    });

    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
      this.setting = setting;
    });

    this.labelsService.getAll(this.userId);
    this.subs.sink = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.subs.sink = this.uploadService.getProfilePicture().subscribe((image) => {
      this.imagePreview = image;
    });

    this.email = this.authenticationService.getUserEmail();

    this.subs.sink = this.getData(this.userId).subscribe((resData) => {
      this.isLoading = false;
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      this.fullname = merge.name.firstname + ' ' + merge.name.lastname;
      this.imagePreview = merge.image;
    });

    this.subs.sink = this.userService.getSubListener().subscribe((userListener) => {
      this.fullname = userListener.name.firstname + ' ' + userListener.name.midlename + ' ' + userListener.name.lastname;
    });

    this.subs.sink = this.repairsService.getSelectedItem().subscribe((res) => {
      this.selectedItem = res;
    });
  }

  getData(userId: string): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    return forkJoin([images, users]);
  }

  onOpenProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45%';
    // set modal attribute
    dialogConfig.data = {
      title: this.profileTitle,
      id: this.userId
    };

    this.dialog.open(ProfileComponent, dialogConfig);
  }

  onToogleLabel() {
    this.showLabel = !this.showLabel;
  }

  onCreateLabel(labelId?: string) {
    this.subs.sink = this.translate.get([
      (labelId) ? 'labels.update-labels' : 'labels.create-labels',
      (labelId) ? 'common.update' : 'common.submit'
    ]).subscribe((translate: string) => {
      this.dialogLabelTitle = translate[(labelId) ? 'labels.update-labels' : 'labels.create-labels'];
      this.dialogLabelButton = translate[(labelId) ? 'common.update' : 'common.submit'];
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: this.dialogLabelTitle,
      btn: this.dialogLabelButton,
      id: labelId
    };
    this.subs.sink = this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.subs.sink = this.translate.get(
          (result === 'update') ? 'common.updated-message' : 'common.created-message',
          {s: this.innerLabelTransalate}
        ).subscribe((translate: string) => {
          this.notificationService.success(translate);
          this.labelsService.getAll(this.userId);
        });
      }
    });
  }

  onDeleteLabel(labelId?: string) {
    this.subs.sink = this.labelsService.delete(labelId).subscribe(() => {
      this.subs.sink = this.translate.get('common.deleted-message', {s: this.innerLabelTransalate})
      .subscribe((translate: string) => {
        this.notificationService.success(translate);
        this.labelsService.getAll(this.userId);
      });
    });
  }

  onCreateNew() {
    this.router.navigate(['/secure/repairs/form']);
  }

  onImportOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    dialogConfig.data = {
      title: this.importTitle
    };

    this.dialog.open(ImportComponent, dialogConfig);
  }

  onExportOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    dialogConfig.data = {
      title: this.exportTitle,
      selectedItem: this.selectedItem
    };

    this.dialog.open(ExportComponent, dialogConfig);
  }

  onPrintOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    dialogConfig.data = {
      title: this.printTitle,
      selectedItem: this.selectedItem
    };

    this.dialog.open(PrintComponent, dialogConfig);
  }

  onFilterLabel(labelId: string) {
    this.labelsService.setSelectedLabel(labelId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
