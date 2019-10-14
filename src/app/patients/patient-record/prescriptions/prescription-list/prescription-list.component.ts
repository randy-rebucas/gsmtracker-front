import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { PrescriptionData } from '../../models/prescription-data.model';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionEditComponent } from '../prescription-edit/prescription-edit.component';
import { ComplaintService } from '../../services/complaint.service';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-prescription-list',
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
  table#prescriptions {
    width: 100%;
    margin: 1em 0;
  }

  table#prescriptions tr td {
    color: rgb(51, 122, 183);
    font-weight: bold;
    font-size: 16px;
    font-family: monospace;
  }

  table#prescriptions tr td span {
    font-weight: 100;
    font-size: 14px;
    font-style: italic;
  }

  table#prescriptions tr td {
    height: unset !important;
    vertical-align: text-bottom;
  }
  table#prescriptions tr td {
    color: rgba(0,0,0,.87) !important;
  }

  table#prescriptions tr td span {
      color: rgb(51, 122, 183);
  }

  td.mat-cell button {
    float: right;
  }
  `],
  templateUrl: './prescription-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class PrescriptionListComponent
extends SecureComponent
implements OnInit, OnDestroy {


  records: PrescriptionService[] = [];
  prs: PrescriptionData[] = [];

  complaintId: string;

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['date', 'action'];
  expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public prescriptionService: PrescriptionService,
    public complaintService: ComplaintService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PrescriptionService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.userId;
        }
      );
    }



  ngOnInit() {
    super.doInit();
    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.prescriptionService
      .getUpdateListener()
      .subscribe((prescriptionData: {prescriptions: PrescriptionData[], count: number}) => {
        this.isLoading = false;
        this.total = prescriptionData.count;
        this.dataSource = new MatTableDataSource(prescriptionData.prescriptions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onPrintPreview(recordId) {

    const args = {
      width: '40%',
      id: recordId,
      dialogTitle: 'Preview Print',
      patient: this.patientId
    };
    super.onPopup(args, RxPadComponent);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onDelete(prescriptionId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.prescriptionService.delete(prescriptionId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
