import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { UsersComponent } from './users.component';
// import { PatientEditComponent } from './patient-edit/patient-edit.component';
// import { PatientDetailComponent } from './patient-detail/patient-detail.component';


@NgModule({
  declarations: [
    UsersComponent,
    // PatientEditComponent,
    // PatientDetailComponent,
    // PatientRecordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class UsersModule {}
