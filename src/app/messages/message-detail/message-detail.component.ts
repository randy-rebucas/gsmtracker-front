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
      this.threadService.get(this.threadId).subscribe(threadData => {
        this.id = threadData._id;
        this.fullname = threadData.fullname;
        this.gender = threadData.gender;
        this.address = threadData.address;
        this.birthdate = threadData.birthdate;
        this.contact = threadData.contact;
        this.personId = threadData.personId;
        this.created = threadData.created;
      });

      this.messageService.getAll(this.threadId);
      this.messageSub = this.messageService.getUpdateListener()
      .subscribe((messageData: {messages: MessagesData[]}) => {
        this.isLoading = false;
        this.messages = messageData.messages;
      });
    });

    this.isNew = false;
  }

  onProfile(personId: string) {
    console.log(personId);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
