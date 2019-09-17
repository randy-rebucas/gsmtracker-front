import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-secure',
  template: `
    <p>
      secure works!
    </p>
  `,
  styleUrls: ['./secure.component.css']
})
export class SecureComponent {
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
  public addresses: any[];
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
  public startDate = new Date(1990, 0, 1);
  public currentDate = new Date();

  /**
   * record types
   */
  public recordId: string;

  /**
   * Application configurations
   */
  public trialDay: number;
  public appName: string;
  public appVersion: string;

  /**
   * Subscriptions
   */
  public authListenerSubs: Subscription;
  public serviceSub: Subscription;

  form: FormGroup;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration
  ) {

  }

  async doInit() {
    this.isLoading = true;

    this.userId = this.authService.getUserId();
    this.userEmail = this.authService.getUserEmail();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    await this.loadConfig().then((config) => {
      this.trialDay = config.config.dayTrial;
      this.appVersion  = config.config.version;
      this.appName = config.config.title;
    });
  }

  async loadConfig() {
    const appConfig = await this.appconfig.ensureInit();
    return {
      config: appConfig
    };
  }

  doDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onPopup(args: any, targetComponent: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = args.width;
    dialogConfig.data = {
      id: args.id,
      title: args.dialogTitle,
      button: args.dialogButton,
      patient: (args.patient) ? args.patient : null
    };
    this.dialog.open(targetComponent, dialogConfig);
  }
}
