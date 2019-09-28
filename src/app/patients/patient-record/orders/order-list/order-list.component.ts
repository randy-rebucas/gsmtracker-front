import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { AssessmentService } from '../../services/assessment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { NotesService } from '../../services/notes.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { OrderService } from '../../services/order.service';
import { OrderData } from '../../models/order-data.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styles: [`
  .hide {
    display: none;
  }
  `]
})
export class OrderListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: OrderService[] = [];
  orders: OrderData[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['order', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public orderService: OrderService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: OrderService,
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

    this.orderService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.orderService
      .getUpdateListener()
      .subscribe((orderData: {orders: OrderData[], count: number}) => {
        this.isLoading = false;
        this.total = orderData.count;
        this.dataSource = new MatTableDataSource(orderData.orders);
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
    this.orderService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onDelete(complaintId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.orderService.delete(complaintId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.orderService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
