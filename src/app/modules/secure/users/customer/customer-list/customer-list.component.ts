import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { SettingsService } from 'src/app/shared/services/settings.service';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomerService } from '../customer.service';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  public length: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;
  public isLoading: boolean;
  public userId: string;

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

  constructor(
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private appConfigurationService: AppConfigurationService,
    private titleService: Title,
    private dialog: MatDialog,
    private customerService: CustomerService
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
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.translate.use((setting) ? setting.language : this.appConfigurationService.language);
    });

    this.translate.get('customers.customer')
    .subscribe((res: string) => {
      this.titleService.setTitle(res);
    });

    this.onReset();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.customerService.getUpdateListener();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.length = data.counts;
          return data.customers;
        }),
        catchError(() => {
          this.isLoading = false;
          return observableOf([]);
        })
      ).subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data);
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

  onUpdate(customerId: string) {}

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
    this.customerService.setSelectedItem(this.selection.selected);
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
    this.customerService.getAll(userId);
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
    this.translate.get('customers.update-customer').subscribe((language) => {
      dialogConfig.data = {
        title: language,
        id: userId
      };
    });

    const dialogRef = this.dialog.open(CustomerFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.getQuery(this.userId);
      }
    });
  }

}
