import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: [``]
})
export class DetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

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
