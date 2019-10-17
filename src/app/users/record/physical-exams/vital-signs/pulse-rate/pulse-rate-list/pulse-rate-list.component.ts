import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { PrData } from '../../../../models/pr.model';
import { PrService } from '../../../../services/pr.service';
import { PulseRateEditComponent } from '../pulse-rate-edit/pulse-rate-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-pulse-rate-list',
  templateUrl: './pulse-rate-list.component.html',
  styles: [`
  .hide {
    display: none;
  }
  #no-data {
      width: 100%;
      text-align: center;
  }
  `]
})
export class PulseRateListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: PrService[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['pulserate', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public prService: PrService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: PrService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.userId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.prService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.prService
      .getUpdateListener()
      .subscribe((prData: {prs: PrData[], count: number}) => {
        this.isLoading = false;
        this.total = prData.count;
        this.dataSource = new MatTableDataSource(prData.prs);
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
    this.prService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, PulseRateEditComponent);
  }

  onEdit(pulseRateId) {
    const args = {
      width: '30%',
      id: pulseRateId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, PulseRateEditComponent);
  }

  onDelete(pulseRateId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.prService.delete(pulseRateId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.prService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
