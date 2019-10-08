import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styles: [`
  .warn {
    color: #ff4081;
  }
  .button-row a {
    margin-right: 8px;
  }
  `]
})
export class VitalSignsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
