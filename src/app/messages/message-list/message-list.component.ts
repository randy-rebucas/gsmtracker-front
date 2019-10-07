import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { ThreadData } from '../thread-data.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { MessagesService } from '../messages.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styles: [`

mat-icon.md-48 {
  font-size: 40px !important;
  width: 40px !important;
  height: 40px !important;
}
small.mat-line {
  float: right;
}
mat-list-item {
  border-left: 3px solid transparent;
  cursor: pointer;
}
mat-list-item.active {
  border-left: 3px solid #3f51b5;
}
p.mat-line.bold {
  font-weight: bold !important;
}
.thread-starter-user {
  padding-left: 1em;
  width: 100%;
}
.thread-starter-user h4 {
  font-weight: 100;
  margin: 0;
}
.thread-starter-user h4 small {
  float: right;
}
.thread-starter-user p {
  margin: 0;
}
.mat-list-base .mat-list-item.mat-3-line, .mat-list-base .mat-list-option.mat-3-line {
  height: 60px;
}
`]
})
export class MessageListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public threadSub: Subscription;
  threads: ThreadData[] = [];
  newThreads: any[] = [];
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private threadService: ThreadsService,
    private notificationService: NotificationService,
    private dialogService: DialogService
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.threadService.getAll(this.userId);
    this.threadSub = this.threadService.getUpdateListener()
    .subscribe((thredData: {threads: ThreadData[]}) => {
      thredData.threads.forEach(element => {
        this.threadService.getMessage(element.id).toPromise()
        .then((results) => {
          const obj = {
            created: element.created,
            fullname: element.fullname,
            id: element.id,
            ownerId: element.ownerId,
            avatar: element.avatar,
            message: results.message.message,
            status: results.message.status
          };
          this.newThreads.push(obj);
        });
      });
      this.isLoading = false;
      this.threads = this.newThreads;
    });
  }

  onDelete(threadId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.threadService.delete(threadId).subscribe(() => {
          this.threadService.getAll(this.userId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
