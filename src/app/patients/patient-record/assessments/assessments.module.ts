import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AssessmentsComponent } from './assessments.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';


@NgModule({
  declarations: [
    AssessmentsComponent,
    AssessmentListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
       { path: '', component: AssessmentsComponent }
    ])
  ]
})
export class AssessmentsModule {}
