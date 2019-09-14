import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AppSettings } from '../shared/appsettings';
import { AppSettingsService } from '../shared/appsettings.service';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @Input() title: string;
  subscriptionType: string;
  settings: AppSettings;
  version: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    private appSettingsService: AppSettingsService,
    private titleService: Title
  ) {
    super(authService, router, dialog);
   }

  ngOnInit() {
    super.doInit();

    this.appSettingsService.getSettings()
    .subscribe(
      settings => this.settings = settings,
      () => null,
      () => {
        this.version = this.settings.defaultVersion;
        this.subscriptionType = this.authService.getUserSubscription();
      });

    this.titleService.setTitle('Home');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
