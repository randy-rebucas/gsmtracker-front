import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/shared/dialog.service';

import { HistoryData } from '../../models/history-data.model';
import { HistoryService } from '../../services/history.service';
import { HistoriesEditComponent } from '../histories-edit/histories-edit.component';

@Component({
  selector: 'app-histories-list',
  templateUrl: './histories-list.component.html',
  styleUrls: ['./histories-list.component.css']
})
export class HistoriesListComponent implements OnInit, OnDestroy {
  total = 0;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  records: HistoryService[] = [];
  isLoading = false;

  userIsAuthenticated = false;
  patientId: string;

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: HistoryService,
    public historyService: HistoryService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService) {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      const splitUrl = snapshot.url.split('/');
      this.patientId = splitUrl[2];
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['type', 'description', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;

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
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
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

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: null,
      title: 'New record',
      patient: this.patientId,
      btnLabel: 'Save'
    };
    this.dialog.open(HistoriesEditComponent, dialogConfig);
  }

  onEdit(historyId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: historyId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(HistoriesEditComponent, dialogConfig);
  }

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
    this.authListenerSubs.unsubscribe();
  }
}
