import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SettingsComponent } from './settings.component';
import { ClinicComponent } from './clinic/clinic.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from '../auth/auth-guard';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    ClinicComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    PerfectScrollbarModule,
    NgxMaterialTimepickerModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: SettingsComponent, canActivate: [AuthGuard], children: [
        { path: '', redirectTo: '/settings/profile', pathMatch: 'full' },
        { path: 'profile', component: ProfileComponent },
        { path: 'clinic', component: ClinicComponent },
        { path: 'notifications', component: NotificationComponent }
      ] }
    ])
  ],
  exports: [
    SettingsComponent,
    ProfileComponent,
    ClinicComponent,
    NotificationComponent
  ]
})
export class SettingsModule {}
