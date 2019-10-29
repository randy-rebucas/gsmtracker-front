import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { QueService } from 'src/app/que/que.service';
import { QueData } from 'src/app/que/que-data.model';

@Component({
  selector: 'app-que-list',
  templateUrl: './que-list.component.html',
  styles: [`
  .hide {
    display: none;
  }

  #no-data {
      width: 100%;
      text-align: center;
  }
  mat-cell:last-of-type {
    justify-content: flex-end;
  }
  `]
})
export class QueListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: QueService[] = [];
  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['que', 'name', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public queService: QueService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: QueService
    ) {
      super(authService, router, dialog, appconfig);
    }

    ngOnInit() {
      super.doInit();

      this.queService.getAll();
      this.recordsSub = this.queService
      .getUpdateListener()
      .subscribe((queData: {ques: QueData[], count: number}) => {
        this.isLoading = false;
        this.total = queData.count;
        this.dataSource = new MatTableDataSource(queData.ques);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

    onDelete(queId) {
      this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.queService.delete(queId).subscribe(() => {
            this.notificationService.warn('! Deleted successfully');
            this.queService.getAll();
          });
        }
      });
    }

    onDetail(patientId) {
      this.router.navigate(['/patients/' + patientId + '/record/chief-complaints']);
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
