import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { AssessmentData } from '../../models/assessment-data.model';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentEditComponent } from '../assessment-edit/assetment-edit.component';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-assessment-list',
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
  table.assessment-table tr td {
    vertical-align: text-bottom;
  }
  `],
  templateUrl: './assessment-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssessmentListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: AssessmentService[] = [];
  assessments: AssessmentData[] = [];

  complaintId: string;

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['complaints', 'action'];
  expandedElement: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AssessmentService,
  ) {
      super(authService, router, dialog);
      this.activatedRoute.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }


  ngOnInit() {
    super.doInit();

    this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.assessmentService
      .getUpdateListener()
      .subscribe((assessmentData: {assessments: AssessmentData[], count: number}) => {
        this.isLoading = false;
        this.total = assessmentData.count;
        this.dataSource = new MatTableDataSource(assessmentData.assessments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onCreate(complaintId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId,
      btnLabel: 'Save'
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  onEdit(assessmentId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: assessmentId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  onDelete(assessmentId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.assessmentService.delete(assessmentId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
