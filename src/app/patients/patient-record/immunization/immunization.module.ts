import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImmunizationComponent } from './immunization.component';
import { ImmunizationListComponent } from './immunization-list/immunization-list.component';
import { ImmunizationEditComponent } from './immunization-edit/immunization-edit.component';


@NgModule({
  declarations: [
    ImmunizationComponent,
    ImmunizationListComponent,
    ImmunizationEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
       { path: '', component: ImmunizationComponent }
    ])
  ],
  entryComponents: [
    ImmunizationEditComponent
  ]
})
export class ImmunizationModule {}
