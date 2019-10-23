import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-result-list',
  templateUrl: './test-result-list.component.html',
  styleUrls: ['./test-result-list.component.css']
})
export class TestResultListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public recordsSub: Subscription;

  files: UploadData[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private activatedRoute: ActivatedRoute,
    public uploadService: UploadService
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.myUserId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.uploadService
      .getUpdateListener()
      .subscribe((fileData: {files: UploadData[], count: number}) => {
        this.isLoading = false;
        this.total = fileData.count;
        this.dataSource = new MatTableDataSource(fileData.files);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
