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

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
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

    private threadService: ThreadsService,
    private notificationService: NotificationService,
    private dialogService: DialogService
    ) {
      super(authService, router, dialog);
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
