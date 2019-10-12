import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MessagesService } from '../messages.service';
import { ThreadsService } from '../threads.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { PatientsService } from 'src/app/patients/patients.service';
export interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styles: [`
  .example-full-width {
    width: 100%;
  }
  .is-loading ::ng-deep .mat-option-text {
    display: flex;
    justify-content: center;
  }
  form.message-form {
    padding: 1em;
    border-top: 1px solid rgba(0,0,0,.14);
  }
  `]
})
export class MessageEditComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @Input() threadId: string;

  filteredUsers: User[] = [];
  setRow: number;
  loading = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private fb: FormBuilder,
    private messageService: MessagesService,
    private threadService: ThreadsService,
    private patientsService: PatientsService,
    private notificationService: NotificationService,
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.form = this.fb.group({
      userInput: new FormControl(null),
      message: new FormControl(null, [Validators.required])
    });

    this.form
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.patientsService.search({name: value}, this.currentPage, this.licenseId)
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

  onSend() {
    if (this.threadId) {
      /**
       * reply
       */
      this.messageService.insert(
        this.form.value.message,
        this.threadId,
        this.userId
      ).subscribe(() => {
        this.messageService.getAll(this.threadId);
        this.form.reset();
      });
    } else {
      /**
       * new thread
       */
      this.threadService.insert(
        this.form.value.message,
        this.form.value.userInput,
        this.userId,
        this.licenseId
      ).subscribe(() => {
        this.threadService.getAll(this.userId);
        this.form.reset();
      });
    }
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
