import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription, merge, Observable, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError, tap } from 'rxjs/operators';
import { User } from '../../user';
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
import { Physicians } from '../../physicians/physicians';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { LabelComponent } from 'src/app/shared/components/label/label.component';
import { LabelsService } from 'src/app/shared/services/labels.service';

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

  private usersSub: Subscription;
  private users: any[] = [];
  private ids: any = [];
  private contacts: any[] = [];
  private hours: any[] = [];
  private addresses: any[];

  public userId: string;
  public avatar: string;

  public patients: any;

  option: string;
  labelSelected: any[];
  labels: any[];
  labelsSub: Subscription;

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = [
    'select',
    'firstname',
    'midlename',
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
    private datePipe: DatePipe,
    private titleService: Title,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private patientsService: PatientsService,
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
  }

  ngOnInit() {
    this.option = this.activatedRoute.snapshot.url[0].path;

    this.userId = this.authenticationService.getUserId();
    this.titleService.setTitle(this.option === 'list' ? 'My Patients' : 'All Patients');

    this.getQuery(this.perPage, this.currentPage);

    this.labelsService.getAll(this.authenticationService.getUserId());
    this.labelsSub = this.labelsService.getLabels()
      .subscribe((res) => {
      this.labels = res.labels;
    });
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
        data => this.dataSource = new MatTableDataSource(this.setOwnerShip(data))
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(
      row => this.selection.select(row)
    );
  }

  onToggleSelect(option: string) {
    if (option === 'all') {
      this.dataSource.data.forEach(
        row => this.selection.select(row)
      );
    } else {
      this.selection.clear();
    }
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

  getQuery(perPage, currentPage) {
    if (this.option === 'list') {
      this.patientsService.getMyPatient(this.userId, perPage, currentPage);
    } else {
      this.patientsService.getAll(perPage, currentPage);
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.length = pageData.length;
    this.getQuery(this.perPage, this.currentPage);
  }

  onUpdate(patientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: patientId,
      title: 'Update',
      button: 'Update'
    };
    this.dialog.open(PatientFormComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.success(':: Updated successfully');
        this.getQuery(this.perPage, this.currentPage);
      }
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

  onExport() {
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'Patients',
      useBom: true,
      noDownload: false,
      headers: [
        'Firstname',
        'Midlename',
        'Lastname',
        'Contact',
        'Gender',
        'Birthdate',
        'Created',
        'Address',
        'City',
        'Province',
        'Country',
        'Postal'
      ]
    };

    const patientList = [];
    for (const iterator of this.selection.selected) {
      const dataObj = {
        fullname: iterator.firstname,
        midlename: iterator.midlename,
        lastname: iterator.lastname,
        contact: iterator.contact,
        gender: iterator.gender,
        birthdate: this.datePipe.transform(iterator.birthdate, 'yyyy-MM-dd'),
        created: this.datePipe.transform(iterator.created, 'yyyy-MM-dd')
      };

      let addressObj = {};
      if (iterator.address.length > 1 ) {
        iterator.address.forEach(el => {
          if (el.current) {
            addressObj = {
              address: el.address1 + ' ' + el.address2,
              city: el.city,
              province: el.province,
              country: el.country,
              postalCode: el.postalCode
            };
          }
        });
      } else {
        addressObj = {
          address: iterator.address[0].address1 + ' ' + iterator.address[0].address2,
          city: iterator.address[0].city,
          province: iterator.address[0].province,
          country: iterator.address[0].country,
          postalCode: iterator.address[0].postalCode
        };
      }

      const mergeObj = {...dataObj, ...addressObj};

      patientList.push(mergeObj);
    }
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(patientList, 'Patients', csvOptions);
  }

  onPrint() {
    const numSelected = this.selection.selected;
    const datePipe = new DatePipe('en-US');
    const pdfDoc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdfDoc.internal.pageSize.height || pdfDoc.internal.pageSize.getHeight();
    const pageWidth = pdfDoc.internal.pageSize.width || pdfDoc.internal.pageSize.getWidth();

    pdfDoc.line(10, 28, 200, 28);

    pdfDoc.setFontSize(10);
    pdfDoc.setFont('courier');
    pdfDoc.text('Fullname', 10, 32, null, null, 'left');
    pdfDoc.text('Contact', 125, 32, null, null, 'left');
    pdfDoc.text('Gender', 155, 32, null, null, 'left');
    pdfDoc.text('Birthdate', 175, 32, null, null, 'left');

    pdfDoc.setFontSize(10);
    pdfDoc.setFont('courier');

    for (let index = 0; index < numSelected.length; index++) {
      const element = numSelected[index];
      pdfDoc.text(element.firstname + ' ' + element.midlename + ', ' + element.lastname, 10, 37 + (index * 8), null, null, 'left');
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
  }

  filterSelection() {
    return this.selection.selected.filter((select) => {
      return select.isOwned === true;
    });
  }

  onDelete() {
    // check for allowed record lenght
    if (this.filterSelection().length) {
      const plural = (this.filterSelection().length > 1) ? '(s)' : '';
      this.dialogService.openConfirmDialog('Are you sure to delete ' + this.filterSelection().length +
      ' item' + plural +
      ' record ?')
      .afterClosed().subscribe(dialogRes => {
        if (dialogRes) {

          this.filterSelection().forEach(element => {
            this.ids.push(element.id);
          });
          this.patientsService.deleteMany(this.ids).subscribe((res) => {
            this.getQuery(this.perPage, this.currentPage);
            this.notificationService.warn('::' + res.message);
          });
        }
      });
    } else {
      this.notificationService.success(':: You are not permitted to take this action!');
    }
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  onCreateLabel(labelId?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: (labelId) ? 'Update label' : 'Create label',
      id: labelId
    };
    this.dialog.open(LabelComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result) {
        const msg = (result === 'update') ? ':: Updated successfully' : ':: Added successfully';
        this.notificationService.success(msg);
        this.labelsService.getAll(this.authenticationService.getUserId());
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
      this.patientsService.setLabel(element.id, this.labelSelected).subscribe((res) => {
        console.log(res);
        this.getQuery(this.perPage, this.currentPage);
        this.notificationService.warn('::' + res.message);
        this.labelSelected = [];
        this.selection.clear();
      });
    });
  }

  checkLabel(labelId: string) {
    return this.labelSelected.find(x => x === labelId);
  }

  ngOnDestroy() {
    // this.usersSub.unsubscribe();
    this.labelsSub.unsubscribe();
  }

}
