import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription, merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { PatientsService } from '../patients.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { LabelComponent } from 'src/app/shared/components/label/label.component';
import { LabelsService } from 'src/app/shared/services/labels.service';
import { QrWriterComponent } from 'src/app/shared/components/qr-writer/qr-writer.component';
import { QrReaderComponent } from 'src/app/shared/components/qr-reader/qr-reader.component';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Settings } from 'src/app/shared/interfaces/settings';
import { PrintComponent } from 'src/app/shared/components/print/print.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ExportComponent } from 'src/app/shared/components/export/export.component';
import { AuthComponent } from 'src/app/shared/components/auth/auth.component';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PatientListComponent implements OnInit, AfterViewInit, OnDestroy {
  public length: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;
  public isLoading: boolean;
  public userId: string;
  public avatar: string;
  public patients: any;

  private ids: any = [];

  option: string;
  labelSelected: any[];
  labelPicked: string;
  labels: any[];
  labelsSub: Subscription;
  setting: Settings;
  settingsData: any;

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = [
    'select',
    'firstname',
    'middlename',
    'lastname',
    'contact',
    'gender',
    'birthdate',
    'age',
    'action'
  ];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private patientsService: PatientsService,
    private translate: TranslateService,
    private appConfigurationService: AppConfigurationService,
    private uploadService: UploadService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private labelsService: LabelsService,
    private dialog: MatDialog
  ) {
    this.length = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [10, 20, 40, 80, 150, 300];
    this.isLoading = true;
    this.labelSelected = [];
    this.labelPicked = '';
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
    });

    this.option = this.activatedRoute.snapshot.url[0].path;

    this.translate.get(this.option === 'list' ? 'patients.my-patients' : 'patients.all-patients')
    .subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
    // this.getQuery(this.perPage, this.currentPage, this.labelPicked);

    this.labelsService.getAll(this.userId);
    this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.labelsService.getSelectedLabel().subscribe((label) => {
      this.labelPicked = label;
      this.filterLabel(label);
    });

    this.onReset();
  }

  getLogo(settingId: string) {
    this.uploadService.get(settingId).subscribe((setting) => {
      console.log(setting);
    });
  }

  filterLabel(labelId: string) {
    this.getQuery(this.perPage, this.currentPage, labelId);
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.patientsService.getUpdateListener();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.length = data.counts;
          return data.patients;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([]);
        })
      ).subscribe(
        data => {
          this.dataSource = new MatTableDataSource(this.setOwnerShip(data));
        }
      );

    this.translate.get([
      'paginator.item-per-page',
      'paginator.next-page',
      'paginator.previous-page'
    ])
    .subscribe(translation => {
      this.paginator._intl.itemsPerPageLabel = translation['paginator.item-per-page'];
      this.paginator._intl.nextPageLabel = translation['paginator.next-page'];
      this.paginator._intl.previousPageLabel = translation['paginator.previous-page'];
      // this.paginator._intl.getRangeLabel = matRangeLabelIntl;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.length;
  }

  isCheckboxChange(row: any) {
      this.selection.toggle(row);
      this.selectListener();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(
      row => {
        this.selection.select(row);
        this.selectListener();
      }
    );
  }

  onToggleSelect(option: string) {
    if (option === 'all') {
      this.dataSource.data.forEach(
        row => {
          this.selection.select(row);
          this.selectListener();
        }
      );
    } else {
      this.selection.clear();
      this.selectListener();
    }
  }

  selectListener() {
    this.patientsService.setSelectedItem(this.selection.selected);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setOwnerShip(data) {
    const newUsers = [];
    data.forEach(user => {
      const ownerShip = {
        isOwned : user.physicians.some(e => e.userId === this.userId)
      };
      newUsers.push({...user, ...ownerShip});
    });
    return newUsers;
  }

  getQuery(perPage, currentPage, label) {
    if (this.option === 'list') {
      this.patientsService.getMyPatient(this.userId, perPage, currentPage, label);
    } else {
      this.patientsService.getAll(perPage, currentPage, label);
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.length = pageData.length;
    this.getQuery(this.perPage, this.currentPage, this.labelPicked);
  }

  onUpdate(patientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    // set modal title
    this.translate.get([
      'patients.update-patients',
      'common.update'
    ]).subscribe((translation) => {
      dialogConfig.data = {
        id: patientId,
        title: translation['patients.update-patients'],
        button: translation['common.update']
      };
    });

    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.translate.get('common.updated-message',
          {s: 'Patient'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.getQuery(this.perPage, this.currentPage, this.labelPicked);
      }
    });
  }

  onScan() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // set modal title
    this.translate.get('qrcode.scan').subscribe((res: string) => {
      dialogConfig.data = {
        title: res
      };
    });

    this.dialog.open(QrReaderComponent, dialogConfig);
  }

  onGenerateQr(patientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // set modal title
    this.translate.get('qrcode.title').subscribe((res: string) => {
      dialogConfig.data = {
        id: patientId,
        title: res
      };
    });

    this.dialog.open(QrWriterComponent, dialogConfig);
  }

  onDetail(user: any) {
    if (!user.isOwned) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      // set modal title
      this.translate.get('qrcode.scan-qrcode').subscribe((res: string) => {
        dialogConfig.data = {
          title: res
        };
      });

      this.dialog.open(QrReaderComponent, dialogConfig);
    } else {
      this.router.navigate(['../', user.id], {relativeTo: this.activatedRoute});
    }
  }

  onReset() {
    this.onToggleSelect('none');
    this.labelPicked = '';
    this.getQuery(this.perPage, this.currentPage, '');
  }

  onExport() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.translate.get([
      'patients.export-patients'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['patients.export-patients'],
        selectedItem: this.selection.selected
      };
    });

    this.dialog.open(ExportComponent, dialogConfig);
  }

  onPrint() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    // set modal title
    this.translate.get([
      'patients.print-patients'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['patients.print-patients'],
        selectedItem: this.selection.selected
      };
    });

    this.dialog.open(PrintComponent, dialogConfig);
  }

  filterSelection() {
    return this.selection.selected.filter((select) => {
      return select.isOwned === true;
    });
  }

  onDelete() {
    // check for allowed record lenght
    if (this.filterSelection().length) {
      this.translate.get('common.confirm-delete-message', {s: this.filterSelection().length}).subscribe((confirmMessage: string) => {
        this.dialogService.openConfirmDialog(confirmMessage)
        .afterClosed().subscribe(dialogRes => {
          if (dialogRes) {

            this.filterSelection().forEach(element => {
              this.ids.push(element.id);
            });
            this.patientsService.deleteMany(this.ids).subscribe((res) => {

              this.translate.get('common.deleted-message', {s: 'Patient'}).subscribe((msg: string) => {
                this.notificationService.success(msg);
              });
              this.getQuery(this.perPage, this.currentPage, this.labelPicked);
            });
          }
        });
      });
    } else {
      this.translate.get('common.not-permitted-message').subscribe((res: string) => {
        this.notificationService.warn(res);
      });
    }
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  onCreateLabel(labelId?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // set modal attribute
    this.translate.get([
      'labels.create-labels',
      'common.submit'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['labels.create-labels'],
        btn: translate['common.submit'],
        id: labelId
      };
    });

    this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.translate.get('common.created-message',
          {s: 'Label'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.labelsService.getAll(this.userId);
      }
    });
  }

  onSelectLabel(e: any, labelId: string) {
    e.stopPropagation();
    if (!this.checkLabel(labelId)) {
      this.labelSelected.push(labelId);
    } else {
      this.labelSelected = this.labelSelected.filter(value => {
         return value !== labelId;
      });
    }
  }

  onApplySelectedLabel() {
    this.filterSelection().forEach(element => {
      this.patientsService.setLabel(element.id, this.labelSelected).subscribe((response) => {
        this.getQuery(this.perPage, this.currentPage, this.labelPicked);
        this.translate.get('common.updated-message',
          {s: 'Label'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.labelSelected = [];
        this.selection.clear();
      });
    });
  }

  checkLabel(labelId: string) {
    return this.labelSelected.find(x => x === labelId);
  }

  onCreateAuth(patientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.translate.get([
      'patients.generate-auth-patients'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['patients.generate-auth-patients'],
        id: patientId
      };
    });

    this.dialog.open(AuthComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.translate.get('common.updated-message',
          {s: 'Patient'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
      }
    });
  }

  ngOnDestroy() {
    this.labelsSub.unsubscribe();
  }

}
