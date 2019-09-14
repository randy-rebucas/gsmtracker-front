import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog, MatDialogConfig } from '@angular/material';
import { AppointmentService } from '../appointment.service';
import { AppointmentData } from '../appointment-data.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppointmentDetailComponent } from '../appointment-detail/appointment-detail.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent
extends SecureComponent
implements OnInit, OnDestroy {
  appointments: AppointmentService[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'start', 'end', 'fullname', 'status', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private dialogService: DialogService
    ) {
      super(authService, router, dialog);
    }

  ngOnInit() {
    super.doInit();

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

  viewEvent(eventId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: eventId
    };
    this.dialog.open(AppointmentDetailComponent, dialogConfig);
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
    super.doDestroy();
  }
}
