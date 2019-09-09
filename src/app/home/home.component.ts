import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AppSettings } from '../shared/appsettings';
import { AppSettingsService } from '../shared/appsettings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() title: string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  subscriptionType: string;
  settings: AppSettings;
  version: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appSettingsService: AppSettingsService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

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
    this.authListenerSubs.unsubscribe();
  }
}
