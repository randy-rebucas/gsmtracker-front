import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { AppConfigurationService } from 'src/app/configs/app-configuration.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { SubSink } from 'subsink';
import { TechnicianFormComponent } from '../technician-form/technician-form.component';
import { TechnicianService } from '../technician.service';

@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.scss']
})
export class TechnicianListComponent implements OnInit, OnDestroy, AfterViewInit {
  public length: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;
  public isLoading: boolean;
  public userId: string;
  private ids: any = [];
  public innerTranslate: string;
  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = [
    'select',
    'name',
    'gender',
    'contact',
    'address',
    'action'
  ];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private subs = new SubSink();
  constructor(
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private appConfigurationService: AppConfigurationService,
    private titleService: Title,
    private dialog: MatDialog,
    private technicianService: TechnicianService
  ) {
    this.length = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [10, 20, 40, 80, 150, 300];
    this.isLoading = true;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {

    this.settingsService.getSetting(this.userId);
    this.subs.sink = this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
    });

    this.subs.sink = this.translate.get('technicians.title')
    .subscribe((res: string) => {
      this.titleService.setTitle(res);
    });

    this.subs.sink = this.translate.get([
      'technicians.technician'
    ]).subscribe((translate: string) => {
        this.innerTranslate = translate['technicians.technician'];
      }
    );

    this.onReset();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subs.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.technicianService.getUpdateListener();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.length = data.counts;
          return data.technicians;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([]);
        })
      ).subscribe(
        data => {
          this.dataSource = new MatTableDataSource(this.setOwnerShip(data));
          console.log(this.dataSource);
        }
      );

    this.subs.sink = this.translate.get([
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

  setOwnerShip(data) {
    const newTechnicians = [];
    data.forEach(technician => {
      const ownerShip = {
        isOwned : technician.ownerId === this.userId,
        isOwner : technician.shopOwnerId === this.userId
      };
      newTechnicians.push({...technician, ...ownerShip});
    });
    return newTechnicians;
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
    this.technicianService.setSelectedItem(this.selection.selected);
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
    this.getQuery(this.userId);
  }

  getQuery(userId: string) {
    this.technicianService.getAll(userId);
  }

  onReset() {
    this.getQuery(this.userId);
  }

  onOpenForm(userId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45%';
    // set modal attribute
    this.translate.get((userId) ? 'technicians.update-technician' : 'technicians.create-technician').subscribe((translate) => {
      dialogConfig.data = {
        title: translate,
        id: userId
      };
    });

    const dialogRef = this.dialog.open(TechnicianFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.getQuery(this.userId);
      }
    });
  }

  onAddSelf() {
    const technicianData = {
      userId: this.userId,
      ownerId: this.userId,
      description: 'shop owner as technician',
      isVerified: true
    };
    this.subs.sink = this.technicianService.insert(technicianData).subscribe(() => {
      this.subs.sink = this.translate.get('common.created-message', {s: this.innerTranslate }
      ).subscribe((norifResMessgae: string) => {
        this.notificationService.success(norifResMessgae);
        this.getQuery(this.userId);
      });
    });
  }

  filterSelection() {
    return this.selection.selected.filter((select) => {
      return select.isOwned === true && select.isOwner !== true;
    });
  }

  onDelete() {
    console.log(this.filterSelection());
    if (this.filterSelection().length) {
      this.subs.sink = this.translate.get('common.confirm-delete-message', {s: this.filterSelection().length})
      .subscribe((confirmMessage: string) => {
        this.subs.sink = this.dialogService.openConfirmDialog(confirmMessage)
        .afterClosed().subscribe(dialogRes => {
          if (dialogRes) {

            this.filterSelection().forEach(element => {
              this.ids.push(element.id);
            });
            this.technicianService.deleteMany(this.ids).subscribe((res) => {

              this.subs.sink = this.translate.get('common.deleted-message', {s: this.innerTranslate }).subscribe((msg: string) => {
                this.notificationService.success(msg);
              });
              this.getQuery(this.userId);
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
