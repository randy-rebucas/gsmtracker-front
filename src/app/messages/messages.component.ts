import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styles: [`
  .message-list {
    min-width: 25%;
    flex: 1 1 auto;
  }
  .message-detail {
    min-width: 45%;
    flex: 1 1 auto;
  }
  .message-updates {
    min-width: 25%;
    flex: 1 1 auto;
  }
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  .mat-card-header .mat-card-title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 400;
  }
  mat-card.message-list-card.mat-card {
    min-height: 800px;
}
  `]
})
export class MessagesComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public titleService: Title
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Messages');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
