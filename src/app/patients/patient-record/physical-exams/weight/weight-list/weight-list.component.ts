import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { WeightData } from '../../../models/weight-data.model';
import { WeightService } from '../../../services/weight.service';
import { WeightEditComponent } from '../weight-edit/weight-edit.component';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-weight-list',
  templateUrl: './weight-list.component.html',
  styleUrls: ['./weight-list.component.css']
})
export class WeightListComponent implements OnInit, OnDestroy {
  isLoading = false;
  total = 0;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  records: WeightService[] = [];
  userIsAuthenticated = false;
  patientId: string;

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: WeightService,
    public weightService: WeightService,
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
    displayedColumns: string[] = ['weight', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;

    this.weightService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.weightService
      .getUpdateListener()
      .subscribe((weightData: {weights: WeightData[], count: number}) => {
        this.isLoading = false;
        this.total = weightData.count;
        this.dataSource = new MatTableDataSource(weightData.weights);
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
    this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
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
    this.dialog.open(WeightEditComponent, dialogConfig);
  }

  onEdit(weightId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: weightId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(WeightEditComponent, dialogConfig);
  }

  onDelete(weightId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.weightService.delete(weightId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
