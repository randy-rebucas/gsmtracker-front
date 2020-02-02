import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    translate.setDefaultLang('de'); // default language
    this.translate.use('en'); // override language
  }

  ngOnInit() {

    this.authSub = this.authenticationService.getAuthStatusListener().subscribe((authState) => {
      if (authState) {
        this.router.navigateByUrl('secure/dashboard');
      }
    });

  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
