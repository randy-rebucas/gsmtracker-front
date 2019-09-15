import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @Input() title: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private titleService: Title
  ) {
    super(authService, router, dialog, appconfig);
   }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Home');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
