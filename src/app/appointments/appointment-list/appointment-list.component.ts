import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { AppointmentService } from '../appointment.service';
import { AppointmentData } from '../appointment-data.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  total = 0;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  appointments: AppointmentService[] = [];
  userId: string;
  isLoading = false;

  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private dialogService: DialogService
    ) {}

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['title', 'start', 'end', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);

    this.recordsSub = this.appointmentService
      .getUpdateListener()
      .subscribe((appointmentData: {appointments: AppointmentData[], count: number}) => {
        this.isLoading = false;
        this.total = appointmentData.count;
        this.dataSource = new MatTableDataSource(appointmentData.appointments);
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
    this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);
  }

  onDelete(appointmentId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.appointmentService.delete(appointmentId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
