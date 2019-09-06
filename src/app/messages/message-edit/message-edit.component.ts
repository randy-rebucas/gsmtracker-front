import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MessagesService } from '../messages.service';
import { ThreadsService } from '../threads.service';
import { NotificationService } from 'src/app/shared/notification.service';
export interface User {
  name: string;
}
@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  filteredUsers: User[] = [];
  messageForm: FormGroup;
  isLoading = false;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  recordId: string;
  patientId: string;
  title: string;

  id: string;
  created: string;
  complaintId: string;
  prescription: any;

  userId: string;
  page = 1;
  setRow: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessagesService,
    private threadService: ThreadsService,
    private notificationService: NotificationService,
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.userId = this.authService.getUserId();

    this.messageForm = this.fb.group({
      userInput: new FormControl(null),
      message: new FormControl(null, [Validators.required])
    });

    this.messageForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.messageService.search({name: value}, this.page, this.userId)
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((users) => {
        this.filteredUsers = users.results;
      });
  }

  displayFn(user: User) {
    if (user) { return user.name; }
  }

  onSend() {
    this.threadService.insert(
      this.messageForm.value.message,
      this.messageForm.value.userInput,
      this.userId
    ).subscribe(() => {
      this.threadService.getAll(this.userId);
      this.messageForm.reset();
      this.setRow = 7;
      this.notificationService.success(':: Message Sent');
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
