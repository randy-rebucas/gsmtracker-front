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

  private threadSub: Subscription;
  threads: ThreadData[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    private threadService: ThreadsService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private messageService: MessagesService
    ) {
      super(authService, router, dialog);
    }

  ngOnInit() {
    super.doInit();

    this.threadService.getAll(this.userId);
    this.threadSub = this.threadService.getUpdateListener()
    .subscribe((thredData: {threads: ThreadData[]}) => {
      this.isLoading = false;
      this.threads = thredData.threads;
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
