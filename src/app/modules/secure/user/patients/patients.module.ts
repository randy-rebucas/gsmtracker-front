import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsComponent } from './patients.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientListComponent } from './patient-list/patient-list.component';

import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    PatientsComponent,
    PatientListComponent,
    PatientFormComponent,
    PatientDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MatTooltipModule,
    SharedModule,
    FlexLayoutModule,
    RouterModule.forChild([
      { path: '', component: PatientsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PatientListComponent },
        { path: 'form', component: PatientFormComponent, canDeactivate: [CanDeactivateGuard] },
        { path: ':patientId', component: PatientDetailComponent, children: [
          { path: '', redirectTo: 'records', pathMatch: 'full' },
          { path: 'records', loadChildren: () => import('./patient-records/patient-records.module').then(m => m.PatientRecordsModule) },
        ] },
      ] }
    ])
  ],
  providers: [DatePipe],
  entryComponents: [
    PatientFormComponent
  ]
})
export class PatientsModule { }
