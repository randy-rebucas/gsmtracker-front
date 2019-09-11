import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { SecureComponent } from '../secure/secure.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public titleService: Title
) {
  super(dialog, authService, router, titleService);
}

  ngOnInit() {
    super.ngOnInit();
    super.onSetTitle('Settings');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
