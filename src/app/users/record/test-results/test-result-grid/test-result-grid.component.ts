import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-result-grid',
  templateUrl: './test-result-grid.component.html',
  styleUrls: ['./test-result-grid.component.css']
})
export class TestResultGridComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public recordsSub: Subscription;

  files: UploadData[] = [];

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
        this.files = fileData.files;
      });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
