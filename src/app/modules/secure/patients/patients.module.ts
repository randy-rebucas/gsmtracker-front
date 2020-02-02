import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PatientsComponent } from './patients.component';
import { AuthenticationGuard } from '../../authentication/authentication.guard';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientListComponent } from './patient-list/patient-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';

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
    SharedModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: PatientsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PatientListComponent },
        { path: 'form', component: PatientFormComponent, canActivate: [AuthenticationGuard] },
        { path: ':patientId', component: PatientDetailComponent },
        { path: ':patientId/edit', component: PatientFormComponent, canActivate: [AuthenticationGuard]  },
        { path: ':patientId/record', loadChildren: './../records/records.module#RecordsModule', canActivate: [AuthenticationGuard]  }
      ] }
    ])
  ],
  entryComponents: [
    PatientFormComponent
  ]
})
export class PatientsModule { }
