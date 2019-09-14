import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { MessagesService } from '../messages.service';
import { MessagesData } from '../messages-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  messages: MessagesData[] = [];

  private messageSub: Subscription;
  public threadId: string;

  id: string;
  fullname: string;
  gender: string;
  address: string;
  birthdate: string;
  personId: string;
  contact: string;
  created: string;
  isNew: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    private route: ActivatedRoute,
    private threadService: ThreadsService,
    private messageService: MessagesService
    ) {
      super(authService, router, dialog);
    }

  ngOnInit() {
    super.doInit();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.threadId = paramMap.get('messageId');
      this.getThreadData(this.threadId)
      .then((results) => {
        this.isLoading = false;
        this.id = results.threadData._id;
        this.fullname = results.threadData.fullname;
        this.gender = results.threadData.gender;
        this.address = results.threadData.address;
        this.birthdate = results.threadData.birthdate;
        this.contact = results.threadData.contact;
        this.personId = results.threadData.personId;
        this.created = results.threadData.created;

        this.messageService.getAll(this.threadId);
        this.messageSub = this.messageService.getUpdateListener()
        .subscribe((messageData: {messages: MessagesData[]}) => {
          this.messages = messageData.messages;
        });
      })
      .catch(err => console.log(err));
    });

  }

  async getThreadData(threadId) {
    const threadResponse = await this.threadService.get(threadId).toPromise();
    return {
      threadData: threadResponse
    };
  }

  onProfile(personId: string) {
    console.log(personId);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
