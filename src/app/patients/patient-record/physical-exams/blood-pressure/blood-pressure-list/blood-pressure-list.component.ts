import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { BpData } from '../../../models/bp-data.model';
import { BpService } from '../../../services/bp.service';
import { BloodPressureEditComponent } from '../blood-pressure-edit/blood-pressure-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-blood-pressure-list',
  templateUrl: './blood-pressure-list.component.html',
  styleUrls: ['./blood-pressure-list.component.css']
})
export class BloodPressureListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: BpService[] = [];
  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['systolic', 'diastolic', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public bpService: BpService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: BpService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.bpService
      .getUpdateListener()
      .subscribe((bpData: {bps: BpData[], count: number}) => {
        this.isLoading = false;
        this.total = bpData.count;
        this.dataSource = new MatTableDataSource(bpData.bps);
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
    this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, BloodPressureEditComponent);
  }

  onEdit(bloodPressureId) {
    const args = {
      width: '30%',
      id: bloodPressureId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, BloodPressureEditComponent);
  }

  onDelete(bloodPressureId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.bpService.delete(bloodPressureId).subscribe(() => {
          this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
