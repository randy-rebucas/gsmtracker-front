import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.css']
})
export class EncountersComponent
extends SecureComponent
implements OnInit, OnDestroy {

  breakpoint: number;

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

    this.breakpoint = (window.innerWidth <= 400) ? 1 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 4;
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
