import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PrescriptionsComponent } from './prescriptions.component';
import { PrescriptionEditComponent } from './prescription-edit/prescription-edit.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { AllergyListComponent } from '../allergies/allergy-list/allergy-list.component';
import { AllergyEditComponent } from '../allergies/allergy-edit/allergy-edit.component';
import { AllergiesComponent } from '../allergies/allergies.component';


@NgModule({
  declarations: [
    PrescriptionsComponent,
    PrescriptionEditComponent,
    PrescriptionListComponent,
    AllergiesComponent,
    AllergyListComponent,
    AllergyEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
       { path: '', component: PrescriptionsComponent }
    ])
  ]
})
export class PrescriptionsModule {}
