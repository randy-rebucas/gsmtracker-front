import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
