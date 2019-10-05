import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { HeightData } from '../../../models/height-data.model';
import { HeightService } from '../../../services/height.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { HeightEditComponent } from '../height-edit/height-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-height-list',
  templateUrl: './height-list.component.html',
  styleUrls: ['./height-list.component.css']
})
export class HeightListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: HeightService[] = [];
  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['height', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public heightService: HeightService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: HeightService
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
  }

  onCreate() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, HeightEditComponent);
  }

  onEdit(heightId) {
    const args = {
      width: '30%',
      id: heightId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, HeightEditComponent);
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
    super.doDestroy();
  }
}
