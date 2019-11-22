import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';



@NgModule({
  declarations: [
    AppointmentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AppointmentsComponent },
    ])
  ]
})
export class AppointmentsModule { }
