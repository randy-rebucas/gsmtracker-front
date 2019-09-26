import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { HistoryData } from '../../models/history-data.model';
import { HistoryService } from '../../services/history.service';
// import { HistoriesEditComponent } from '../histories-edit/histories-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styles: [``]
})
export class OrderListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: HistoryService[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['type', 'description', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public historyService: HistoryService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: HistoryService
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

    this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.historyService
      .getUpdateListener()
      .subscribe((historyData: {histories: HistoryData[], count: number}) => {
        this.isLoading = false;
        this.total = historyData.count;
        this.dataSource = new MatTableDataSource(historyData.histories);
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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
  }

//   onCreate() {
//     const args = {
//       width: '30%',
//       id: null,
//       dialogTitle: 'New Record',
//       dialogButton: 'Save',
//       patient: this.patientId
//     };
//     super.onPopup(args, HistoriesEditComponent);
//   }

//   onEdit(historyId) {
//     const args = {
//       width: '30%',
//       id: historyId,
//       dialogTitle: 'Update Record',
//       dialogButton: 'Update',
//       patient: this.patientId
//     };
//     super.onPopup(args, HistoriesEditComponent);
//   }

  onDelete(historyId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.historyService.delete(historyId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
