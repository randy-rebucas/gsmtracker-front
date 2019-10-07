import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { RprData } from '../../../models/rpr-data.model';
import { RprService } from '../../../services/rpr.service';
import { RespiratoryRateEditComponent } from '../respiratory-rate-edit/respiratory-rate-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-respiratory-rate-list',
  templateUrl: './respiratory-rate-list.component.html',
  styleUrls: ['./respiratory-rate-list.component.css']
})
export class RespiratoryRateListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: RprService[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['respiratoryrate', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public rprService: RprService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: RprService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.userId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.rprService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.rprService
      .getUpdateListener()
      .subscribe((rprData: {rprs: RprData[], count: number}) => {
        this.isLoading = false;
        this.total = rprData.count;
        this.dataSource = new MatTableDataSource(rprData.rprs);
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
    this.rprService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, RespiratoryRateEditComponent);
  }

  onEdit(respiratoryRateId) {
    const args = {
      width: '30%',
      id: respiratoryRateId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, RespiratoryRateEditComponent);
  }

  onDelete(respiratoryRateId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.rprService.delete(respiratoryRateId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.rprService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
