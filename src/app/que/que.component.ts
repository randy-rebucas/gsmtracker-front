import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { QueData } from '../que/que-data.model';
import { QueService } from '../que/que.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-que',
  templateUrl: './que.component.html',
  styles: [`
  mat-list-item.lead-0 h3 {
    font-size: 8rem;
    margin: 0;
    font-weight: 100;
    line-height: 1;
  }
  mat-list-item.lead-0 p {
    margin: 0;
    font-size: 3rem;
  }
  mat-list-item.lead-1 h3 {
    font-size: 6rem;
    margin: 0;
    font-weight: 100;
    line-height: 1;
  }
  mat-list-item.lead-1 p {
    font-size: 30px;
    margin: 0;
  }
  .mat-list-item-content {
    border-bottom: 1px solid gainsboro !important;
    padding: 1em;
  }
  mat-list-item.lead-2 h3 {
    font-size: 4rem;
    font-weight: 100;
    margin: 0;
    line-height: 1;
  }
  mat-list-item.lead-2 p {
    font-size: 22px;
    line-height: 1;
    margin-top: 0;
}
  mat-list-item.lead-3 h3 {
    font-size: 2em;
    font-weight: 100;
    margin: 0;
    line-height: 1;
  }
  mat-list-item.lead-3 p {
    font-size: 20px;
    line-height: 1;
    margin: 0rem 0 1em;
}
  mat-list-item.lead-4 h3 {
    font-weight: 100;
    margin: 0;
    line-height: 1;
  }
  mat-list-item:first-child {
    position: relative;
  }
  mat-list-item:first-child:before {
    content: "Serving :";
    position: absolute;
    left: -195px;
    top: 50px;
  }
  `]
})
export class QueComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public queSub: Subscription;
  queing: QueData[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private queService: QueService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private route: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.queService.getAll(this.licenseId);
    this.queSub = this.queService
    .getUpdateListener()
    .subscribe((queData: {ques: QueData[]}) => {
      this.isLoading = false;
      this.queing = queData.ques;
    });
  }

  onDelete(quedId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.queService.delete(quedId).subscribe(() => {
          this.queService.getAll(this.licenseId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  gotoRecord(patientId) {
    this.router.navigate(['/patients/' + patientId + '/record/chief-complaints']);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
