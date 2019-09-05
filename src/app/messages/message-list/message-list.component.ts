import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ThreadsService } from '../threads.service';
import { ThreadData } from '../thread-data.model';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  patients: Section[] = [
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
    },
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
    },
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
  doctors: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
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
    private threadService: ThreadsService
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

  messageDetail(messageId: string) {
    this.router.navigate(['./', messageId], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
