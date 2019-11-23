import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { AppointmentsService } from '../appointments.service';
import { Appointments } from '../appointments';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;
  public isLoading: boolean;

  public appointmentSub: Subscription;

  public dataSource: MatTableDataSource<any>;
  public columnsToDisplay: string[] = ['img', 'fullname', 'title', 'start', 'status', 'action'];
  public selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public appointmentsService: AppointmentsService,
  ) {
    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
   }

  ngOnInit() {
    this.appointmentsService.getAll(this.perPage, this.currentPage);
    this.appointmentSub = this.appointmentsService
    .getUpdateListener()
    .subscribe((appointmentData: {appointments: Appointments[], count: number}) => {
      this.isLoading = false;
      this.total = appointmentData.count;
      this.dataSource = new MatTableDataSource(appointmentData.appointments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewEvent(eventId) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '30%';
    // dialogConfig.data = {
    //     id: eventId
    // };
    // this.dialog.open(AppointmentDetailComponent, dialogConfig);
  }

  // onDelete(appointmentId) {
  //   this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
  //   .afterClosed().subscribe(res => {
  //     if (res) {
  //       this.appointmentService.delete(appointmentId).subscribe(() => {
  //         this.notificationService.warn('! Deleted successfully');
  //         this.appointmentService.getAll(this.perPage, this.currentPage);
  //       });
  //     }
  //   });
  // }

  onDelete() {
    // const numSelected = this.selection.selected;
    // const plural = (numSelected.length > 1) ? '(s)' : '';
    // this.dialogService.openConfirmDialog('Are you sure to delete ' + numSelected.length +
    // ' item' + plural +
    // ' record ?')
    // .afterClosed().subscribe(res => {
    //   if (res) {
    //     numSelected.forEach(element => {
    //       this.ids.push(element.id);
    //     });

    //     this.userService.delete(this.ids).subscribe((data) => {
    //       this.userService.getAll(this.perPage, this.currentPage);
    //       this.notificationService.warn('::' + data.message);
    //     });
    //   }
    // });
  }

  onCreate() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '50%';
    // dialogConfig.data = {
    //   id: null,
    //   title: 'Create New ' + this.userType,
    //   button: 'Save',
    //   userType: this.userType
    // };
    // this.dialog.open(UserFormComponent, dialogConfig);
  }
  // onChangedPage(pageData: PageEvent) {
  //   this.isLoading = true;
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.perPage = pageData.pageSize;
  //   this.userService.getAll(this.perPage, this.currentPage);
  // }

  ngOnDestroy() {
    this.appointmentSub.unsubscribe();
  }
}
