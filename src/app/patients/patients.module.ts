import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthGuard } from '../auth/auth-guard';

import { PatientsComponent } from './patients.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { RecordModule } from '../shared/record/record.module';


@NgModule({
  declarations: [
    PatientsComponent,
    PatientEditComponent,
    PatientListComponent,
    PatientDetailComponent,
    PatientRecordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    FormsModule,
    EditorModule,
    RecordModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: PatientsComponent, canActivate: [AuthGuard], children: [
        { path: '', component: PatientListComponent },
        { path: ':userId', component: PatientDetailComponent },
        { path: ':userId/record', component: PatientRecordComponent, children: [
          { path: '', redirectTo: 'chief-complaints', pathMatch: 'full' },
          { path: 'chief-complaints', loadChildren: './patient-record/chief-complaint/chief-complaint.module#ChiefComplaintModule'},
          { path: 'histories', loadChildren: './patient-record/histories/histories.module#HistoriesModule'},
          { path: 'physical-exams', loadChildren: './patient-record/physical-exams/physical-exams.module#PhysicalExamsModule'},
          { path: 'orders', loadChildren: './patient-record/orders/orders.module#OrdersModule'},
          { path: 'prescriptions', loadChildren: './patient-record/prescriptions/prescriptions.module#PrescriptionsModule'},
          { path: 'test-results', loadChildren: './patient-record/test-results/test-result.module#TestResultModule'},
          { path: 'progress-notes', loadChildren: './patient-record/progress-notes/progress-notes.module#ProgressNotesModule'},
          { path: 'assessments', loadChildren: './patient-record/assessments/assessments.module#AssessmentsModule'},
          { path: 'immunizations', loadChildren: './patient-record/immunization/immunization.module#ImmunizationModule'},
        ] },
      ] }
    ])
  ],
  entryComponents: [
    PatientEditComponent
  ]
})
export class PatientsModule {}
