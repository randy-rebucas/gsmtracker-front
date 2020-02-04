import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { PatientRecordListComponent } from './patient-record-list/patient-record-list.component';
import { PatientRecordFormComponent } from './patient-record-form/patient-record-form.component';
import { PatientRecordDetailComponent } from './patient-record-detail/patient-record-detail.component';

@NgModule({
  declarations: [
    PatientRecordListComponent,
    PatientRecordDetailComponent,
    PatientRecordFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: PatientRecordListComponent },
      { path: ':recordId', component: PatientRecordDetailComponent }
    ])
  ],
  entryComponents: [
    PatientRecordFormComponent
  ]
})
export class PatientRecordsModule { }