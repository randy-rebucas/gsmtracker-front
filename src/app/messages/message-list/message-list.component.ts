import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { ThreadData } from '../thread-data.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private threadSub: Subscription;
  private authListenerSubs: Subscription;
  threads: ThreadData[] = [];

  isLoading = false;
  userId: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private threadService: ThreadsService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private messageService: MessagesService
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;
    this.userId = this.authService.getUserId();
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
    this.authListenerSubs.unsubscribe();
  }
}
