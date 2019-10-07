import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { ImmunizationData } from '../../models/immunization-data.model';
import { ImmunizationService } from '../../services/immunization.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { ImmunizationEditComponent } from '../immunization-edit/immunization-edit.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-immunization-list',
  templateUrl: './immunization-list.component.html',
  styleUrls: ['./immunization-list.component.css']
})
export class ImmunizationListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: ImmunizationService[] = [];
  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['vaccine', 'dose', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public immunizationService: ImmunizationService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: ImmunizationService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.userId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.immunizationService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.immunizationService
    .getUpdateListener()
    .subscribe((immunizationData: {immunizations: ImmunizationData[], count: number}) => {
      this.isLoading = false;
      this.total = immunizationData.count;
      this.dataSource = new MatTableDataSource(immunizationData.immunizations);
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
    super.onPopup(args, ImmunizationEditComponent);
  }

  onEdit(heightId) {
    const args = {
      width: '30%',
      id: heightId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, ImmunizationEditComponent);
  }

  onDelete(immunizationId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.immunizationService.delete(immunizationId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.immunizationService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
