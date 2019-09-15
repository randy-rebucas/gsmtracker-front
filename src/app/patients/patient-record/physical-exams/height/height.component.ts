import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-height',
  templateUrl: './height.component.html',
  styleUrls: ['./height.component.css']
})
export class HeightComponent
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
