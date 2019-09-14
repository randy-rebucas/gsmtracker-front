import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AppConfiguration } from '../app-configuration.service';
import { SecureComponent } from '../secure/secure.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent
extends SecureComponent
implements OnInit, OnDestroy {

  title: string;
  subscriptionType: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    private breakpointObserver: BreakpointObserver,
    appconfig: AppConfiguration
    ) {
      super(authService, router, dialog);
      this.title = appconfig.title;
    }

    ngOnInit() {
      super.doInit();
      this.subscriptionType = this.authService.getUserSubscription();
    }

    onLogout() {
      this.authService.logout();
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
