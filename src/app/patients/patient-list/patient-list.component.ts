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
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-patient-list',
  styles: [`

  .hide {
    display: none;
  }

  .search-div {
    position: relative;
    width: 15%;
  }
  .mat-form-field {
    width: 100%;
  }
  .search-div > div {
    position: absolute;
    top: 1rem;
    right: 0;
  }
  .search-div > div img {
    cursor: pointer;
  }
  .action-button {
    width: 70%;
    text-align: right;
    padding: 1em 0;
  }
  .support-div {
    text-align: right;
    width: 23%;
}
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  .mat-card-header .mat-card-title {
    font-size: 16px;
  }
  dl dd {
    padding-left: 5em;
  }
  dl {
    padding: 1em 0;
    margin: 0;
  }
  dt {
    float: left;
    width: 100px;
  }
  .mat-column-image {
      width: 5%;
  }
  mat-row.example-detail-row {
    min-height: 0;
  }
  .example-element-detail {
    width: 100%;
  }

  .area.header {
    display: flex;
    flex-direction: row;
  }
  .area.header > div:not(:first-child) {
    margin-left: 1em;
  }

  mat-row.example-element-row mat-cell:first-child ,
  mat-header-row.mat-header-row mat-header-cell:first-child {
    max-width: 30px;
  }
  .action-button button {
    margin-left: 10px;
  }
  mat-cell:last-of-type, mat-footer-cell:last-of-type, mat-header-cell:last-of-type {
    flex: 0 0 auto;
  }
  mat-header-row.mat-header-row mat-header-cell:last-child {
    flex: 0 0 auto;
    width: 80px;
  }
  :host /deep/ .mat-list-item-content {
    /* CSS styles go here */
    margin: 0px;
    padding: 0 !important;
    max-height: 42px;
  }
  mat-list-item {
    max-height: 42px;
  }
  .birthday-user {
    width: 100%;
    padding-left: 1em;
  }
  .birthday-user p {
    padding: 0;
    margin: 0;
  }
  .birthday-user h4 {
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
  .birthday-user p span {
    float: right;
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
  columnsToDisplay: string[] = ['select', 'image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  selection = new SelectionModel<any>(true, []);

  private Ids: any = [];
  public birthdays: any = [];
  users: any[] = [];

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

    this.usersService.getBirthdays(this.licenseId).subscribe((birthday) => {

      birthday.users.forEach(user => {
        const today = new Date();
        const bDate = new Date(user.birthdate);
        let myage = today.getFullYear() - bDate.getFullYear();
        const m = today.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
          myage--;
        }
        const obj = {
          useId: user.users._id,
          birthdate: user.birthdate,
          age: myage,
          fullname: user.firstname + ', ' + user.lastname,
          avatar: user.users.avatarPath,
          contact: user.contact
        };
        this.users.push(obj);
      });
      this.birthdays = this.users;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onDeleteAll() {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        const numSelected = this.selection.selected;
        numSelected.forEach(element => {
          this.Ids.push(element.id);
        });

        this.usersService.deleteAll(this.Ids).subscribe((data) => {
          this.usersService.getAll('patient', this.licenseId, this.perPage, this.currentPage);
          this.notificationService.warn('::' + data.message);
        });
      }
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
