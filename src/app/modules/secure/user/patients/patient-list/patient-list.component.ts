import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { User } from '../../user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../../settings/settings.service';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { TypeService } from 'src/app/shared/services/type.service';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from '../../user.service';
import { PatientsService } from '../patients.service';
import { Patients } from '../patients';
import { Physicians } from '../../physicians/physicians';

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
  public length: number;
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
  public columnsToDisplay: string[] = [
    'image',
    'fullname',
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

  private userTypeId: string;
  public userId: string;
  public avatar: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private userService: UserService,
    private patientsService: PatientsService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private typeService: TypeService,
    private dialog: MatDialog,
    private uploadService: UploadService
  ) {
    this.length = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
    this.isLoading = true;
  }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();

    this.titleService.setTitle('Patients');

    this.patientsService.getAll(this.perPage, this.currentPage);
    this.usersSub = this.patientsService.getUpdateListener().subscribe((userData: {patients: any[], counts: number}) => {
      this.isLoading = false;

      const newUsers = [];
      userData.patients.forEach(user => {
        user.physicians.filter((physician: Physicians) => {
          const ownerShip = {
            isOwned : physician.userId === this.userId
          };
          newUsers.push({...user, ...ownerShip});
        });
      });

      this.dataSource = new MatTableDataSource(newUsers);
      this.length = this.dataSource.data.length;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  onDelete(patientId: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(dialogRes => {
      if (dialogRes) {
        this.patientsService.delete(patientId).subscribe((patientRes) => {
          // delete related user data
          this.userService.delete(patientRes.id).subscribe(() => {
            this.patientsService.getAll(this.perPage, this.currentPage);
            this.notificationService.warn('::' + patientRes.message);
          });
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
    this.patientsService.getAll(this.perPage, this.currentPage);
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: null,
      title: 'Create New',
      button: 'Save'
    };
    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe(() => {
      this.notificationService.success(':: Added successfully');
      this.patientsService.getAll(this.perPage, this.currentPage);
    });
  }

  onEdit(patientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: patientId,
      title: 'Update',
      button: 'Update'
    };
    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe(() => {
      this.notificationService.success(':: Updated successfully');
      this.patientsService.getAll(this.perPage, this.currentPage);
    });
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

  onDetail(userId: string) {
    this.router.navigate(['../', userId], {relativeTo: this.activatedRoute});
  }

  onPrint() {

    this.settingsService.getSetting(this.userId).toPromise()
      .then((results) => {
        const datePipe = new DatePipe('en-US');
        const pdfDoc = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
        const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();

        // clinic owner
        pdfDoc.setFontSize(16);
        pdfDoc.setFont('normal');
        // this.uploadService.get(results._id).subscribe((res) => {
        //   pdfDoc.addImage(res.image, 'PNG', 10, 10, 18, 18);
        // });
        pdfDoc.text(results.name, 10, 10, null, null, 'left');
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('courier');
        this.addresses = results.addresses;
        this.addresses.forEach(element => {
          pdfDoc.text(element.address1, 10, 14, null, null, 'left');
          let gap = 0;
          if (element.address2) {
            gap = 4;
            pdfDoc.text(element.address2, 10, 18, null, null, 'left');
          }
          pdfDoc.text('' + element.postalCode + '', 10, 18 + gap, null, null, 'left');
          pdfDoc.text(element.province, 45, 18 + gap, null, null, 'left');
          pdfDoc.text(element.city, 70, 18 + gap, null, null, 'left');
          pdfDoc.text(element.country, 10, 22 + gap, null, null, 'left');
        });

        pdfDoc.text('Clinic hour', 125, 14, null, null, 'left');
        this.hours = results.hours;
        for (let index = 0; index < this.hours.length; index++) {
          const element = this.hours[index];
          pdfDoc.text(element.morningOpen + ' - ' + element.afternoonClose, 155, 14 + ( index * 4 ), null, null, 'left');
        }

        pdfDoc.text('Tel no: ', 125, 18, null, null, 'left');
        this.contacts = results.phones;
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
  
  ngOnDestroy() {
    // this.usersSub.unsubscribe();
  }

}
