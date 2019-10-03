import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../angular-material.module';
import { EncountersComponent } from './encounters/encounters.component';
import { ChiefComplaintComponent } from './chief-complaint/chief-complaint.component';
import { ChiefComplaintEditComponent } from './chief-complaint/chief-complaint-edit/chief-complaint-edit.component';
import { ChiefComplaintListComponent } from './chief-complaint/chief-complaint-list/chief-complaint-list.component';
import { ChiefComplaintLatestComponent } from './chief-complaint/chief-complaint-latest/chief-complaint-latest.component';
import { HistoriesComponent } from './histories/histories.component';
import { PhysicalExamsComponent } from './physical-exams/physical-exams.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { AssessmentEditComponent } from './assessments/assessment-edit/assetment-edit.component';
import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { AssessmentLatestComponent } from './assessments/assessment-latest/assessment-latest.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { PrescriptionEditComponent } from './prescriptions/prescription-edit/prescription-edit.component';
import { PrescriptionListComponent } from './prescriptions/prescription-list/prescription-list.component';
import { ProgressNotesComponent } from './progress-notes/progress-notes.component';
import { ProgressNoteEditComponent } from './progress-notes/progress-note-edit/progress-note-edit.component';
import { ProgressNoteListComponent } from './progress-notes/progress-note-list/progress-note-list.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { TestResultListComponent } from './test-results/test-result-list/test-result-list.component';
import { TestResultDetailComponent } from './test-results/test-result-detail/test-result-detail.component';
import { TestResultInitialComponent } from './test-results/test-result-initial/test-result-initial.component';
import { PhysicalExamsModule } from './physical-exams/physical-exams.module';
import { ChiefComplaintDetailComponent } from './chief-complaint/chief-complaint-detail/chief-complaint-detail.component';
import { EncounterListComponent } from './encounters/encounter-list/encounter-list.component';
import { EncounterEditComponent } from './encounters/encounter-edit/encounter-edit.component';
import { PrescriptionLatestComponent } from './prescriptions/prescription-latest/prescription-latest.component';
import { ProgressNoteLatestComponent } from './progress-notes/progress-note-latest/progress-note-latest.component';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { TestResultEditComponent } from './test-results/test-result-edit/test-result-edit.component';
import { EncounterFormComponent } from './encounters/encounter-form/encounter-form.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';

import { FlexLayoutModule } from '@angular/flex-layout';
/**
 * imported outside of this directory to gain access of <app-upload></app-upload> component selector
 */
import { UploadModule } from 'src/app/upload/upload.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HistoriesModule } from './histories/histories.module';
import { AllergyEditComponent } from './allergies/allergy-edit/allergy-edit.component';
import { AllergyListComponent } from './allergies/allergy-list/allergy-list.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { TestResultModule } from './test-results/test-result.module';
import { TestResultGridComponent } from './test-results/test-result-grid/test-result-grid.component';
import { EndrosementComponent } from './endorsement/endorsement.component';
import { EndorsementListComponent } from './endorsement/endorsement-list/endorsement-list.component';
import { EndorsementFormComponent } from './endorsement/endorsement-form/endorsement-form.component';
import { ImmunizationComponent } from './immunization/immunization.component';
import { ImmunizationListComponent } from './immunization/immunization-list/immunization-list.component';
import { ImmunizationEditComponent } from './immunization/immunization-edit/immunization-edit.component';

@NgModule({
  declarations: [
    EncountersComponent,
    EncounterListComponent,
    EncounterEditComponent,
    EncounterFormComponent,
    ChiefComplaintComponent,
    ChiefComplaintEditComponent,
    ChiefComplaintListComponent,
    ChiefComplaintLatestComponent,
    ChiefComplaintDetailComponent,
    EndrosementComponent,
    EndorsementListComponent,
    EndorsementFormComponent,
    PhysicalExamsComponent,
    AssessmentsComponent,
    AssessmentEditComponent,
    AssessmentListComponent,
    AssessmentLatestComponent,
    PrescriptionsComponent,
    PrescriptionEditComponent,
    PrescriptionListComponent,
    PrescriptionLatestComponent,
    ProgressNotesComponent,
    TestResultsComponent,
    TestResultListComponent,
    TestResultDetailComponent,
    TestResultInitialComponent,
    TestResultGridComponent,
    TestResultEditComponent,
    ProgressNoteEditComponent,
    ProgressNoteListComponent,
    ProgressNoteLatestComponent,
    PatientChartComponent,
    OrdersComponent,
    OrderListComponent,
    OrderEditComponent,
    AllergiesComponent,
    AllergyEditComponent,
    AllergyListComponent,
    ImmunizationComponent,
    ImmunizationListComponent,
    ImmunizationEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PhysicalExamsModule,
    RouterModule,
    UploadModule,
    EditorModule,
    HistoriesModule,
    TestResultModule,
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ]
})
export class PatientRecordsModule {}
