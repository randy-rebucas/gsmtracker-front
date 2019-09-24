import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SecureComponent } from '../secure/secure.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styles: [`
  .sidenav-container {
    height: 100%;
  }

  .sidenav {
      width: 250px;
      margin-top: 4em;
  }

  mat-toolbar.fix-nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1;
    left: 0;
  }

  mat-icon.sidenav-icon {
    margin-right: 15px;
  }
  /**/

  :host {
      display: block;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      z-index: 1000;
  }

  .nav-brand {
      width: 250px;
  }

  .topnav-icon {
      text-decoration: none;
      display: flex;
      color: #fff;
  }

  span.nav-spacer {
      flex: 1 1 auto;
  }

  .visible-md {
      display: none;
  }

  .visible-sm {
      display: none;
  }

  @media screen and (max-width: 992px) {
      .visible-md {
          display: block;
      }
  }

  @media screen and (max-width: 768px) {
      .visible-sm {
          display: block;
      }
      .nav-brand {
          width: 100%;
      }
  }

  @media screen and (max-width: 768px) {
      .hidden-sm {
          display: none;
      }
  }
  @media (min-width: 320px) and (max-width: 576px) {
    .sidenav {
      margin-top: unset;
    }
  }
  @media (min-width: 1200px) {
    .sidenav {
      transform: none;
      visibility: visible;
    }
  }

  div#app-details {
    position: fixed;
    bottom: 0;
    padding: 1em;
  }
  `]
})
export class MainNavComponent
extends SecureComponent
implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver
    ) {
      super(authService, router, dialog, appconfig);

    }

    ngOnInit() {
      super.doInit();
    }

    onLogout() {
      this.authService.logout();
    }

    changeLang(language: string) {
      this.translate.use(language);
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
