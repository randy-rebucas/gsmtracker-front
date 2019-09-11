import { Component, OnInit, OnDestroy, ViewChild, Optional, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
import { SecureComponent } from 'src/app/secure/secure.component';

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
export class PatientListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private patients: PatientData[] = [];
  private patientsSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public titleService: Title,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private patientsService: PatientsService
  ) {
    super(dialog, authService, router, titleService);
  }

  columnsToDisplay: string[] = ['image', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  expandedElement: any;

  ngOnInit() {
    super.ngOnInit();
    super.onSetTitle('Patients');

    this.patientsService.getAll(this.userId, this.perPage, this.currentPage);
    this.patientsSub = this.patientsService
      .getUpdateListener()
      .subscribe((patientData: {patients: PatientData[], patientCount: number}) => {
        this.isLoading = false;
        this.total = patientData.patientCount;
        this.dataSource = new MatTableDataSource(patientData.patients);
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

  onFilter(patientId) {
    this.router.navigate(['./', patientId], {relativeTo: this.route});
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.patientsService.getAll(this.userId, this.perPage, this.currentPage);
  }

  onQue(patientId) {
    super.onPopup(patientId, 'Add to Que', 'Move', '50%', PatientEditComponent); // change to que component
  }

  onCreate() {
    super.onPopup(null, 'New patient', 'Save', '50%', PatientEditComponent);
  }

  onEdit(patientId) {
    super.onPopup(patientId, 'Update patient', 'Update', '50%', PatientEditComponent);
  }

  onDelete(patientId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.patientsService.delete(patientId).subscribe(() => {
          this.patientsService.getAll(this.userId, this.perPage, this.currentPage);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.patientsSub.unsubscribe();
  }
}
