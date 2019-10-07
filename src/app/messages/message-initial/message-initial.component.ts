import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-message-initial',
  templateUrl: './message-initial.component.html',
  styles: [`
  .md-48 {
    font-size: 40px !important;
    width: 40px !important;
    height: 40px !important;
  }
  `]
})
export class MessageInitialComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public appconfig: AppConfiguration
  ) {
    super(authService, router, dialog, appconfig);
  }

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
