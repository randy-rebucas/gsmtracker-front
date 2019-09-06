import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { MessagesService } from '../messages.service';
import { MessagesData } from '../messages-data.model';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit, OnDestroy {

  messages: MessagesData[] = [];
  userIsAuthenticated = false;
  private messageSub: Subscription;
  private authListenerSubs: Subscription;

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

  isLoading = false;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private threadService: ThreadsService,
    private messageService: MessagesService
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

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
    this.authListenerSubs.unsubscribe();
  }
}
