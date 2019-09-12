import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public titleService: Title
) {
  super(authService, router, dialog);
}

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Settings');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
