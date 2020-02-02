import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit } from '@angular/core';
import { PlansService } from 'src/app/shared/services/plans.service';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { SettingsService } from '../settings.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { Settings } from '../settings';
export interface Setting {
  settingId: string;
  general: any;
  notification: any;
  subscription: string;
}

export interface PlanItems {
  quantity: number;
  item: string;
  unitPrice: number;
}

const PLAN_DATA: PlanItems[] = [
  {quantity: 1, item: 'set pc', unitPrice: 35000},
  {quantity: 1, item: 'printer', unitPrice: 8000},
];

export interface Plans {
  name: string;
  slug: string;
  packages: [];
}
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  public subscribed: boolean;
  public plans: any;
  public userId: string;

  planColumns: string[] = ['quantity', 'item', 'price'];
  planSource = PLAN_DATA;

  public subscription: string;
  public subscriptionDate: Date;
  private settingId: string;

  private settingSub: Subscription;

  public package: string;
  public packages: any;

  private subscriptions: [];
  constructor(
    private planService: PlansService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService
  ) {
    this.subscribed = false;
   }

  ngOnInit() {

    this.settingsService.get(this.authenticationService.getUserId());
    this.settingSub = this.settingsService
    .getUpdateListener()
    .subscribe((settingData: any) => {
      this.subscription = (settingData.settings[0].subscription[0]) ?
        settingData.settings[0].subscription[0].plan :
        null;
      this.subscriptionDate = (settingData.settings[0].subscription[0]) ?
        settingData.settings[0].subscription[0].subscriptionDate :
        null;
      this.settingId = (settingData) ? settingData.settings[0]._id : null;

      if (this.subscription) {
        this.planService.getById(this.subscription).subscribe((activePlan) => {
          this.package = activePlan.name;
          this.packages = activePlan.packages;
        });
      }

    });

    this.planService.getAll().subscribe((subscriptions: {plans: Plans[]}) => {
      this.plans = subscriptions.plans;
    });
  }

  onUpdatePlan(subscriptionId: string) {

    const updatedSubscription = {
      id: this.settingId,
      subscription: subscriptionId,
      subscriptionDate: new Date()
    };

    this.settingsService.updateSubscription(updatedSubscription).subscribe((subscription) => {
      this.settingsService.get(this.authenticationService.getUserId());
      this.notificationService.success(subscription.message);
    });
  }

  ngOnDestroy() {
    this.settingSub.unsubscribe();
  }
}
