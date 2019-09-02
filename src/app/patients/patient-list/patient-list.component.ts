import { Component, OnInit, OnDestroy, ViewChild, Optional, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { PatientData } from '../patient-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PatientsService } from '../patients.service';

import { NotificationService } from 'src/app/shared/notification.service';

import { PatientEditComponent } from '../patient-edit/patient-edit.component';
import { DialogService } from 'src/app/shared/dialog.service';

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
  }
  .example-element-description {
      padding: 16px;
      width: 100%;
  }
  td.mat-cell.cdk-column-action.mat-column-action {
    text-align: right;
  }
  td.mat-cell.cdk-column-action.mat-column-action button {
      visibility: hidden;
  }
  tr:hover td.mat-cell.cdk-column-action.mat-column-action button {
      visibility: visible;
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
export class PatientListComponent implements OnInit, OnDestroy {
  totalPatients = 0;
  patientsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  patients: PatientData[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  private patientsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PatientData,
    public patientsService: PatientsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  expandedElement: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
    this.patientsSub = this.patientsService
      .getPatientUpdateListener()
      .subscribe((patientData: {patients: PatientData[], patientCount: number}) => {
        this.isLoading = false;
        this.totalPatients = patientData.patientCount;
        this.dataSource = new MatTableDataSource(patientData.patients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilter(patientId) {
    this.router.navigate(['./', patientId], {relativeTo: this.route});
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.patientsPerPage = pageData.pageSize;
    this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
  }

  onQue(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: patientId,
        title: 'On Que'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: null,
      title: 'New patient',
      btnLabel: 'Save'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onEdit(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: patientId,
        title: 'Update patient',
        btnLabel: 'Update'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onDelete(patientId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.patientsService.deletePatient(patientId).subscribe(() => {
          this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    this.patientsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
