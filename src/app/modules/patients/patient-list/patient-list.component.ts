import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../../user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../user/user';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../settings/settings.service';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { AuthenticationService } from '../../authentication/authentication.service';

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
export class PatientListComponent implements OnInit, OnDestroy {
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;
  public isLoading: boolean;

  private usersSub: Subscription;
  private users: any[] = [];
  private ids: any = [];
  private contacts: any[] = [];
  private hours: any[] = [];
  private addresses: any[];

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = ['select', 'image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  public selection = new SelectionModel<any>(true, []);
  public expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private userId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService
  ) {
    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();
    this.titleService.setTitle('Users');
    this.userService.getAll(this.perPage, this.currentPage);
    this.usersSub = this.userService
    .getUpdateListener()
    .subscribe((userData: {users: User[], counts: number}) => {
      this.isLoading = false;
      this.total = userData.counts;
      this.dataSource = new MatTableDataSource(userData.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    ' item' + plural +
    ' record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        numSelected.forEach(element => {
          this.ids.push(element.id);
        });

        this.userService.delete(this.ids).subscribe((data) => {
          this.userService.getAll(this.perPage, this.currentPage);
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
        pdfDoc.addImage(results.settingData.imagePath, 'PNG', 10, 10, 18, 18);
        pdfDoc.text(results.settingData.clinicName, 35, 10, null, null, 'left');
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        this.addresses = results.settingData.addresses;
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
        this.hours = results.settingData.hours;
        for (let index = 0; index < this.hours.length; index++) {
          const element = this.hours[index];
          pdfDoc.text(element.morningOpen + ' - ' + element.afternoonClose, 155, 14 + ( index * 4 ), null, null, 'left');
        }

        pdfDoc.text('Tel no: ', 125, 18, null, null, 'left');
        this.contacts = results.settingData.phones;
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
    const settingResponse = await this.settingsService.getOwnSetting(this.userId).toPromise();
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
    this.userService.getAll(this.perPage, this.currentPage);
  }

  onCreate() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '50%';
    // dialogConfig.data = {
    //   id: null,
    //   title: 'Create New ' + this.userType,
    //   button: 'Save',
    //   userType: this.userType
    // };
    // this.dialog.open(UserFormComponent, dialogConfig);
  }

  onEdit(patientId) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '50%';
    // dialogConfig.data = {
    //   id: patientId,
    //   title: 'Update ' + this.userType,
    //   button: 'Update',
    //   userType: this.userType
    // };
    // this.dialog.open(UserFormComponent, dialogConfig);
  }

  onScan() {
    // const args = {
    //   width: '30%',
    //   id: null,
    //   dialogTitle: 'Scan Code',
    //   dialogButton: null
    // };
    // super.onPopup(args, QrCodeScannerComponent);
  }

  onDetail(userId) {
    this.router.navigate(['./', userId], {relativeTo: this.activatedRoute});
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
