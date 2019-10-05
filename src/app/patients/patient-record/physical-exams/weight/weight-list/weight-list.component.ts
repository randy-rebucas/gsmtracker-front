import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { WeightData } from '../../../models/weight-data.model';
import { WeightService } from '../../../services/weight.service';
import { WeightEditComponent } from '../weight-edit/weight-edit.component';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-weight-list',
  templateUrl: './weight-list.component.html',
  styleUrls: ['./weight-list.component.css']
})
export class WeightListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: WeightService[] = [];

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public weightService: WeightService,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,

    private notificationService: NotificationService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: WeightService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['weight', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    super.doInit();

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
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, WeightEditComponent);
  }

  onEdit(weightId) {
    const args = {
      width: '30%',
      id: weightId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, WeightEditComponent);
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
    super.doDestroy();
  }
}
