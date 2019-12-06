import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AccountComponent } from './account/account.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneralComponent } from './general/general.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';
import { PaymentComponent } from './payment/payment.component';
import { PlanComponent } from './plan/plan.component';
import { NotificationComponent } from './notification/notification.component';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { AdsModule } from 'src/app/shared/components/ads/ads.module';


@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
    GeneralComponent,
    UploadComponent,
    PaymentComponent,
    PlanComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AvatarModule,
    AdsModule,
    MatTableModule,
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
