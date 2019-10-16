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
// import { PatientEditComponent } from '../patient-edit/patient-edit.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { QrCodeScannerComponent } from 'src/app/qr-code/qr-code-scanner/qr-code-scanner.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { UserData } from 'src/app/users/user-data.model';
import { SelectionModel } from '@angular/cdk/collections';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { SettingsGeneralService } from 'src/app/settings/settings-general.service';

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
    margin-bottom: 1em;
    border-top: 1px solid #bdbdbd;
    padding-top: 10px !important;
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
  templateUrl: './user-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserListComponent
extends SecureComponent
implements OnInit, OnDestroy {
  public userType: string;
  public birthdays: any = [];
  public addresses: any[];

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = ['select', 'image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private usersSub: Subscription;
  private users: any[] = [];
  private ids: any = [];
  private contacts: any[] = [];
  private hours: any[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,
    private activatedRoute: ActivatedRoute,

    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    public settingsGeneralService: SettingsGeneralService
  ) {
    super(authService, router, dialog, appconfig);

  }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.params.subscribe(
      (param) => {
        this.userType = param.userType;
        this.titleService.setTitle('Users: ' + param.userType);
        this.usersService.getAll(this.userType, this.licenseId, this.perPage, this.currentPage);
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
    );

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
    const numSelected = this.selection.selected;
    const plural = (numSelected.length > 1) ? '(s)' : '';
    this.dialogService.openConfirmDialog('Are you sure to delete ' + numSelected.length +
    ' item' + plural + ' of ' + this.userType +
    ' record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        numSelected.forEach(element => {
          this.ids.push(element.id);
        });

        this.usersService.deleteAll(this.ids).subscribe((data) => {
          this.usersService.getAll(this.userType, this.licenseId, this.perPage, this.currentPage);
          this.notificationService.warn('::' + data.message);
        });
      }
    });
  }

  onPrint() {
    this.getSettingsData()
      .then((results) => {
        const datePipe = new DatePipe('en-US');
        const pdfDoc = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
        const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();

        // clinic owner
        pdfDoc.setFontSize(16);
        pdfDoc.setFont('normal');
        pdfDoc.addImage(results.settingData.logoPath, 'PNG', 10, 10, 18, 18);
        pdfDoc.text(results.settingData.clinicName, 35, 10, null, null, 'left');
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        this.addresses = results.settingData.address;
        this.addresses.forEach(element => {
          pdfDoc.text(element.address1, 35, 14, null, null, 'left');
          let gap = 0;
          if (element.address2) {
            gap = 4;
            pdfDoc.text(element.address2, 35, 18, null, null, 'left');
          }
          pdfDoc.text('' + element.postalCode + '', 35, 18 + gap, null, null, 'left');
          pdfDoc.text(element.province, 45, 18 + gap, null, null, 'left');
          pdfDoc.text(element.city, 70, 18 + gap, null, null, 'left');
          pdfDoc.text(element.country, 35, 22 + gap, null, null, 'left');
        });

        pdfDoc.text('Clinic hour', 125, 14, null, null, 'left');
        this.hours = results.settingData.clinicHours;
        for (let index = 0; index < this.hours.length; index++) {
          const element = this.hours[index];
          pdfDoc.text(element.morningOpen + ' - ' + element.afternoonClose, 155, 14 + ( index * 4 ), null, null, 'left');
        }

        pdfDoc.text('Tel no: ', 125, 18, null, null, 'left');
        this.contacts = results.settingData.clinicPhone;
        for (let index = 0; index < this.contacts.length; index++) {
          const element = this.contacts[index];
          pdfDoc.text(element.contact, 155, 18 + ( index * 4 ), null, null, 'left');
        }

        pdfDoc.line(10, 28, 200, 28);

        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        pdfDoc.text('Patient Id', 10, 32, null, null, 'left');
        pdfDoc.text('Fullname', 70, 32, null, null, 'left');
        pdfDoc.text('Contact', 125, 32, null, null, 'left');
        pdfDoc.text('Gender', 155, 32, null, null, 'left');
        pdfDoc.text('Birthdate', 175, 32, null, null, 'left');

        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        const numSelected = this.selection.selected;
        for (let index = 0; index < numSelected.length; index++) {
          const element = numSelected[index];
          pdfDoc.text(element.id, 10, 37 + (index * 8), null, null, 'left');
          pdfDoc.text(element.firstname + ' ' + element.midlename + ', ' + element.lastname, 70, 37 + (index * 8), null, null, 'left');
          pdfDoc.text(element.contact, 125, 37 + (index * 8), null, null, 'left');
          pdfDoc.text(element.gender, 155, 37 + (index * 8), null, null, 'left');
          pdfDoc.text(datePipe.transform(element.birthdate, 'MMM dd, yyyy'), 175, 37 + (index * 8), null, null, 'left');
          pdfDoc.text('Address: ', 15, 41 + (index * 8), null, null, 'left');
          element.address.forEach(el => {
            if (el.current) {
              pdfDoc.text(el.address1 + '' + (el.address2) ? el.address2 : '' + ', ' +
              el.postalCode +
              el.province + el.city + el.country, 35, 41 + (index * 8), null, null, 'left');
            }
          });
        }
        pdfDoc.autoPrint();
        pdfDoc.output('dataurlnewwindow');
      });

  }

  async getSettingsData() {
    const settingResponse = await this.settingsGeneralService.get(this.licenseId).toPromise();
    return {
      settingData: settingResponse
    };
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
    this.usersService.getAll(this.userType, this.userId, this.perPage, this.currentPage);
  }

  onCreate() {
    const args = {
      width: '50%',
      id: null,
      dialogTitle: 'Create New',
      dialogButton: 'Save'
    };
    // super.onPopup(args, PatientEditComponent);
  }

  onEdit(patientId) {
    const args = {
      width: '50%',
      id: patientId,
      dialogTitle: 'Update Patient',
      dialogButton: 'Update'
    };
    // super.onPopup(args, PatientEditComponent);
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
          this.usersService.getAll(this.userType, this.licenseId, this.perPage, this.currentPage);
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
