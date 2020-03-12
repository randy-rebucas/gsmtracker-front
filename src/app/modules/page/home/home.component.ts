import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AppConfigurationService } from '../../../configs/app-configuration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  config: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appConfigurationService: AppConfigurationService
  ) {}

  ngOnInit() {
    this.config = this.appConfigurationService;

    if (this.authenticationService.getIsAuth()) {
      this.router.navigateByUrl('secure/users');
    }

  }

  ngOnDestroy() {}
}
