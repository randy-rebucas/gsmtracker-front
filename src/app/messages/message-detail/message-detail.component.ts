import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { MessagesService } from '../messages.service';
import { MessagesData } from '../messages-data.model';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];

  messages: MessagesData[] = [];
  userIsAuthenticated = false;
  private messageSub: Subscription;
  private authListenerSubs: Subscription;

  public messageId: string;

  id: string;
  fullname: string;
  gender: string;
  address: string;
  birthdate: string;
  personId: string;
  contact: string;
  created: string;

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
      this.messageId = paramMap.get('messageId');
      this.threadService.get(this.messageId).subscribe(threadData => {
        this.id = threadData._id;
        this.fullname = threadData.fullname;
        this.gender = threadData.gender;
        this.address = threadData.address;
        this.birthdate = threadData.birthdate;
        this.contact = threadData.contact;
        this.personId = threadData.personId;
        this.created = threadData.created;
      });

      this.messageService.getAll(this.messageId);
      this.messageSub = this.messageService.getUpdateListener()
      .subscribe((messageData: {messages: MessagesData[]}) => {
        this.isLoading = false;
        this.messages = messageData.messages;
      });
    });
  }

  onProfile(personId: string) {
    console.log(personId);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
