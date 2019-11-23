import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { Subscription } from 'rxjs';
import { Messages } from '../messages';
import { AuthenticationService } from '../../authentication/authentication.service';

// export interface MessagesExtended extends Messages {
//   fullname: string;
//   avatar: string;
//   message: [];
// }

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  public isLoading: boolean;
  public messages: Messages[];

  private messageSub: Subscription;
  private userId: string;
  constructor(
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId();

    this.messagesService.getAll(this.userId);
    this.messageSub = this.messagesService.getUpdateListener()
    .subscribe((messageData: {messages: Messages[]}) => {
        this.isLoading = false;
        this.messages = messageData.messages;
    });
  }

  onAction(type: string, messageId: string) {
    // archieve, delete, mark as unread
    // this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    // .afterClosed().subscribe(res => {
    //   if (res) {
    //     this.threadService.delete(threadId).subscribe(() => {
    //       this.threadService.getAll(this.userId);
    //       this.notificationService.warn('! Deleted successfully');
    //     });
    //   }
    // });
  }

}
