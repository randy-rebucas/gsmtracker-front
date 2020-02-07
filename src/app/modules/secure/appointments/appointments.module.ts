import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthenticationGuard } from '../../authentication/authentication.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppointmentsComponent } from './appointments.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';

@NgModule({
  declarations: [
    AppointmentsComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    AppointmentDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild([
      { path: '', component: AppointmentsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: AppointmentListComponent },
        { path: 'form', component: AppointmentFormComponent, canActivate: [AuthenticationGuard] },
        { path: ':appointmentId', component: AppointmentDetailComponent },
        { path: ':appointmentId/edit', component: AppointmentFormComponent, canActivate: [AuthenticationGuard]  }
      ] }
    ])
  ],
  entryComponents: [
    AppointmentFormComponent,
    AppointmentDetailComponent
  ]
})
export class AppointmentsModule { }
