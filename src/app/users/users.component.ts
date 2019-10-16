import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppConfiguration } from '../app-configuration.service';
import { SecureComponent } from '../secure/secure.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent
extends SecureComponent
implements OnInit, OnDestroy {

  selected = new FormControl(0);

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
