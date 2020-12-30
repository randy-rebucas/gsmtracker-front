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

import { trigger, style, state, transition, animate } from '@angular/animations';
import { LabelComponent } from 'src/app/shared/components/label/label.component';
import { LabelsService } from 'src/app/shared/services/labels.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Settings } from 'src/app/shared/interfaces/settings';
import { PrintComponent } from 'src/app/shared/components/print/print.component';
import { ExportComponent } from 'src/app/shared/components/export/export.component';
import { RepairsService } from '../repairs.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import 'rxjs/add/operator/filter';
import { SubSink } from 'subsink';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-repair-list',
  templateUrl: './repair-list.component.html',
  styleUrls: ['./repair-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RepairListComponent implements OnInit, AfterViewInit, OnDestroy {

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
  innerTranslate: string;
  selectedCurrency: string;
  public statusListener = new FormControl();

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = [
    'select',
    'customer',
    'phone',
    'warranty',
    'technician',
    'amount',
    'created',
    'status',
    'action'
  ];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // isChecked: boolean;
  private subs = new SubSink();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private repairsService: RepairsService,
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
    // this.isChecked = true;
  }

  ngOnInit() {
    this.option = this.activatedRoute.snapshot.url[0].path;

    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
    });

    this.subs.sink = this.translate.get([
      'repairs.repair'
    ]).subscribe((translate: string) => {
        this.innerTranslate = translate['repairs.repair'];
      }
    );

    this.subs.sink = this.translate.get(this.option === 'list' ? 'repairs.my-repairs' : 'repairs.all-repairs')
    .subscribe((res: string) => {
      this.titleService.setTitle(res);
    });

    this.labelsService.getAll(this.userId);
    this.subs.sink = this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });

    this.subs.sink = this.labelsService.getSelectedLabel().subscribe((label) => {
      this.labelPicked = label;
      this.filterLabel(label);
    });

    this.onReset();
  }

  isChecked(status: string) {
    return (status === 'pending') ? false : true;
  }

  onChangeStatus(repairId: string, initialStatus: string) {
    const updateRepair = {
      _id: repairId,
      status: (initialStatus === 'pending') ? 'done' : 'pending'
    };

    this.subs.sink = this.repairsService.update(updateRepair).subscribe();
  }

  getLogo(settingId: string) {
    this.subs.sink = this.uploadService.get(settingId).subscribe((setting) => {
      console.log(setting);
    });
  }

  filterLabel(labelId: string) {
    this.getQuery(this.perPage, this.currentPage, labelId, (this.option === 'list') ? this.userId : '');
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subs.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.repairsService.getUpdateListener();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.length = data.counts;
          return data.repairs;
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

    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .pipe(
      switchMap(setting => {
        this.setting = setting;
        return this.uploadService.get(setting._id);
      })
    )
    .subscribe((mergeRes) => {
      const settingResponse = { ...this.setting, ...mergeRes };
      this.selectedCurrency = settingResponse.currency;
    });
  }

  setOwnerShip(data) {
    const newRepairs = [];
    data.forEach(repair => {
      const ownerShip = {
        isOwned : repair.owners.some(e => e.ownerId === this.userId)
      };
      newRepairs.push({...repair, ...ownerShip});
    });
    return newRepairs;
  }

  getQuery(perPage: number, currentPage: number, label: string, userId: string) {
    this.repairsService.getAll(perPage, currentPage, label, userId);
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
    this.repairsService.setSelectedItem(this.selection.selected);
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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.length = pageData.length;
    this.getQuery(this.perPage, this.currentPage, this.labelPicked, (this.option === 'list') ? this.userId : '');
  }

  onUpdate(repairId: string) {
    this.router.navigate(['/secure/repairs/form', repairId]);
  }

  onReset() {
    this.onToggleSelect('none');
    this.labelPicked = '';
    this.getQuery(this.perPage, this.currentPage, '', (this.option === 'list') ? this.userId : '');
  }

  onExport() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    this.subs.sink = this.translate.get([
      'repairs.export-repairs'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['repairs.export-repairs'],
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
    this.subs.sink = this.translate.get([
      'repairs.print-repairs'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['repairs.print-repairs'],
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
      this.subs.sink = this.translate.get('common.confirm-delete-message', {s: this.filterSelection().length})
      .subscribe((confirmMessage: string) => {
        this.subs.sink = this.dialogService.openConfirmDialog(confirmMessage)
        .afterClosed().subscribe(dialogRes => {
          if (dialogRes) {

            this.filterSelection().forEach(element => {
              this.ids.push(element.id);
            });
            this.repairsService.deleteMany(this.ids).subscribe((res) => {

              this.subs.sink = this.translate.get('common.deleted-message', {s: this.innerTranslate }).subscribe((msg: string) => {
                this.notificationService.success(msg);
              });
              this.getQuery(this.perPage, this.currentPage, this.labelPicked, (this.option === 'list') ? this.userId : '');
            });
          }
        });
      });
    } else {
      this.subs.sink = this.translate.get('common.not-permitted-message').subscribe((res: string) => {
        this.notificationService.warn(res);
      });
    }
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  onCreateLabel(labelId?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // set modal attribute
    this.subs.sink = this.translate.get([
      'labels.create-labels',
      'common.submit'
    ]).subscribe((translate) => {
      dialogConfig.data = {
        title: translate['labels.create-labels'],
        btn: translate['common.submit'],
        id: labelId
      };
    });

    this.subs.sink = this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
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
      this.repairsService.setLabel(element.id, this.labelSelected).subscribe(() => {
        this.getQuery(this.perPage, this.currentPage, this.labelPicked, (this.option === 'list') ? this.userId : '');
        this.subs.sink = this.translate.get('common.updated-message',
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

  ngOnDestroy() {
    this.labelsSub.unsubscribe();
    this.subs.unsubscribe();
  }

}
