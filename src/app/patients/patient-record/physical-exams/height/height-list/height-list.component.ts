import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { HeightData } from '../../../models/height-data.model';
import { HeightService } from '../../../services/height.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { HeightEditComponent } from '../height-edit/height-edit.component';

@Component({
  selector: 'app-height-list',
  templateUrl: './height-list.component.html',
  styleUrls: ['./height-list.component.css']
})
export class HeightListComponent implements OnInit, OnDestroy {
  total = 0;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  records: HeightService[] = [];
  isLoading = false;

  userIsAuthenticated = false;
  patientId: string;

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: HeightService,
    public heightService: HeightService,
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
    displayedColumns: string[] = ['height', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;

    this.heightService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.heightService
      .getUpdateListener()
      .subscribe((heightData: {heights: HeightData[], count: number}) => {
        this.isLoading = false;
        this.total = heightData.count;
        this.dataSource = new MatTableDataSource(heightData.heights);
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
    this.heightService.getAll(this.perPage, this.currentPage, this.patientId);
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
    this.dialog.open(HeightEditComponent, dialogConfig);
  }

  onEdit(heightId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: heightId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(HeightEditComponent, dialogConfig);
  }

  onDelete(heightId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.heightService.delete(heightId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.heightService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
