import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-secure',
  template: `
    <p>
      secure works!
    </p>
  `,
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit, OnDestroy {

  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
