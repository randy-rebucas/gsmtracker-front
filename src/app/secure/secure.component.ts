import { Component, OnInit, OnDestroy} from '@angular/core';
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
  /**
   * datalist options
   */
  public total = 0;
  public perPage = 10;
  public currentPage = 1;
  public pageSizeOptions = [5, 10, 25, 100];

  /**
   * person data types
   */
  public personId: string;
  public image: string;
  public firstname: string;
  public midlename: string;
  public lastname: string;
  public contact: string;
  public gender: string;
  public birthdate: string;
  public address: string;

  /**
   * patient data types
   */
  public patientId: string;
  public bloodType: string;
  public comments: string;

  /**
   * user/client types
   */
  public userId: string;
  public userEmail: string;
  public userSubscription: string;

  /**
   * common variables
   */
  public userIsAuthenticated = false;
  public isLoading = false;

  /**
   * record types
   */
  public recordId: string;

  /**
   * Subscriptions
   */
  public authListenerSubs: Subscription;
  public serviceSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userEmail = this.authService.getUserEmail();
    this.userSubscription = this.authService.getUserSubscription();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    this.isLoading = true;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
