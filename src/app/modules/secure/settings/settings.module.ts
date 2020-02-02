import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { AccountComponent } from './account/account.component';
import { GeneralComponent } from './general/general.component';
import { PaymentComponent } from './payment/payment.component';
import { PlanComponent } from './plan/plan.component';
import { NotificationComponent } from './notification/notification.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
    GeneralComponent,
    PaymentComponent,
    PlanComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    SharedModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: SettingsComponent, children: [
        { path: '', redirectTo: 'general', pathMatch: 'full' },
        { path: 'general', component: GeneralComponent },
        { path: 'account', component: AccountComponent },
        { path: 'payment', component: PaymentComponent },
        { path: 'plan', component: PlanComponent },
        { path: 'notification', component: NotificationComponent }
      ] }
    ])
  ]
})
export class SettingsModule { }
