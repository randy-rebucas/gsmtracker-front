import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MessagesService } from 'src/app/messages/messages.service';
export interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  assessmentId: string;
  userId: string;
  page = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  isLoading = false;

  minDate = new Date();
  form: FormGroup;
  filteredUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private messageService: MessagesService,
    private notificationService: NotificationService
    ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      userInput: new FormControl(null),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
      }),
      start: new FormControl(null, {
        validators: [Validators.required]
      }),
      end: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.form
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
    if (user) {
      return user.name;
    }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.appointmentService.insert(
      this.form.value.userInput,
      this.form.value.title,
      this.form.value.start,
      this.form.value.end,
      this.userId
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
