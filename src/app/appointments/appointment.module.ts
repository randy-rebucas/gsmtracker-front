import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from '../auth/auth-guard';

import { AppointmentsComponent } from './appointments.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppointmentsComponent,
    AppointmentListComponent,
    AppointmentCalendarComponent,
    AppointmentEditComponent,
    AppointmentDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    FormsModule,
    FullCalendarModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: AppointmentsComponent, canActivate: [AuthGuard], children: [
        { path: '', component: AppointmentListComponent },
        { path: 'calendar', component: AppointmentCalendarComponent },
      ]}
    ])
  ],
  entryComponents: [
    AppointmentEditComponent,
    AppointmentDetailComponent
  ]
})
export class AppointmentModule {}
