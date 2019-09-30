import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { AuthService } from 'src/app/auth/auth.service';

import { NotificationService } from 'src/app/shared/notification.service';
import { PatientEditComponent } from '../patient-edit/patient-edit.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { QrCodeScannerComponent } from 'src/app/qr-code/qr-code-scanner/qr-code-scanner.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { UserData } from 'src/app/users/user-data.model';

@Component({
  selector: 'app-patient-list',
  styles: [`
  table {
    width: 100%;
  }
  tr {
    cursor: pointer;
  }
  tr.example-detail-row {
      height: 0;
  }
  tr.example-element-row:not(.example-expanded-row):hover {
      background: #efefef;
  }
  tr.example-element-row:not(.example-expanded-row):active {
      background: #efefef;
  }
  .example-element-row td {
      border-bottom-width: 0;
  }
  .example-element-detail {
      overflow: hidden;
      display: flex;
  }
  .example-element-diagram {
      min-width: 80px;
      border: 2px solid black;
      padding: 8px;
      font-weight: lighter;
      margin: 8px 0;
      height: 104px;
  }
  .example-element-symbol {
      font-weight: bold;
      font-size: 40px;
      line-height: normal;
      text-align: center;
  }
  .example-element-description {
      padding: 16px 0;
      position: relative;
      margin-right: 2em;
  }
  .element-metadata {
    padding: 16px 0;
    position: relative;
  }
  .example-element-description .view {
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
  }
  .example-element-detail > div {
    width: 40%;
  }
  dl {
    margin: 0;
  }
  .example-element-description:hover .view {
    visibility: visible;
  }
  td.mat-cell.cdk-column-action.mat-column-action {
    text-align: right;
  }
  .hide {
    display: none;
  }
  .component-page-header {
    padding: 2em 0 0;
  }
  dl {
    margin-top: 0;
  }
  dt {
    float: left;
    width: 100px;
  }
  .search-div {
    position: relative;
  }
  .search-div > div {
    position: absolute;
    top: 1rem;
    left: 12%;
  }
  .search-div > div img {
    cursor: pointer;
  }
  .example-element-description dl dd {
    padding-left: 5em;
  }
  .example-element-detail {
    position: relative;
  }
  .example-element-detail button {
    position: absolute;
    right: 0;
    top: 0;
  }
  td.mat-cell img {
    border: 2px solid transparent;
  }
  td.mat-cell:hover img {
    border: 2px solid #e0e0e0;
  }
  `],
  templateUrl: './patient-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PatientListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private usersSub: Subscription;

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Patients');
    this.usersService.getAll('patient', this.licenseId, this.perPage, this.currentPage);
    this.usersSub = this.usersService
      .getUpdateListener()
      .subscribe((userData: {users: UserData[], counts: number}) => {
        this.isLoading = false;
        this.total = userData.counts;
        this.dataSource = new MatTableDataSource(userData.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
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
    this.usersService.getAll('patient', this.userId, this.perPage, this.currentPage);
  }

  onCreate() {
    const args = {
      width: '50%',
      id: null,
      dialogTitle: 'Create New',
      dialogButton: 'Save'
    };
    super.onPopup(args, PatientEditComponent);
  }

  onEdit(patientId) {
    const args = {
      width: '50%',
      id: patientId,
      dialogTitle: 'Update Patient',
      dialogButton: 'Update'
    };
    super.onPopup(args, PatientEditComponent);
  }

  onScan() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'Scan Code',
      dialogButton: null
    };
    super.onPopup(args, QrCodeScannerComponent);
  }

  onDelete(Id) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.usersService.delete(Id).subscribe(() => {
          this.usersService.getAll('patient', this.licenseId, this.perPage, this.currentPage);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  /**
   * userId
   */
  onDetail(userId) {
    this.router.navigate(['./', userId], {relativeTo: this.route});
  }

  ngOnDestroy() {
    super.doDestroy();
    this.usersSub.unsubscribe();
  }
}
