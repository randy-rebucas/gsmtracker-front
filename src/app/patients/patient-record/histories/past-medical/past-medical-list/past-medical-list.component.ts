import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { SecureComponent } from 'src/app/secure/secure.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FamilyHistoryService } from '../../../services/family-history.service';
import { FamilyHistoryData } from '../../../models/family-history-data';
import { PastMedicalService } from '../../../services/past-medical.service';
import { PastMedicalData } from '../../../models/past-medical-data.model';

@Component({
  selector: 'app-past-medical-list',
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
  td.mat-cell button {
    float: right;
  }
  .example-element-assessment h4 {
    font-weight: 500;
    text-decoration: underline;
    font-size: 16px;
}
  `],
  templateUrl: './past-medical-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PastMedicalListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: PastMedicalService[] = [];

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

    public pastMedicalService: PastMedicalService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.pastMedicalService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.pastMedicalService
      .getUpdateListener()
      .subscribe((pastMedicalData: {pastMedicals: PastMedicalData[], count: number}) => {
        this.isLoading = false;
        this.total = pastMedicalData.count;
        this.dataSource = new MatTableDataSource(pastMedicalData.pastMedicals);
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

  onDelete(progressNoteId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.pastMedicalService.delete(progressNoteId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.pastMedicalService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
