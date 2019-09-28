import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { NoteData } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-chief-complaint-list',
  templateUrl: './chief-complaint-list.component.html',
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
  `],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ChiefComplaintListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: ComplaintService[] = [];

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

    public complaintService: ComplaintService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: NotesService,
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

    this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.complaintService
      .getUpdateListener()
      .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
        this.isLoading = false;
        this.total = complaintData.count;
        this.dataSource = new MatTableDataSource(complaintData.complaints);
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
        this.complaintService.delete(progressNoteId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
