import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatMenuModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { EventsComponent } from 'src/app/shared/components/events/events.component';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
    AppointmentsComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    AppointmentDetailComponent,
    EventsComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    AvatarModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
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
