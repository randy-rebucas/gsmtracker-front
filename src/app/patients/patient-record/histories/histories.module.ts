import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HistoriesComponent } from './histories.component';
import { SocialComponent } from './social/social.component';
import { SocialListComponent } from './social/social-list/social-list.component';
import { SocialFormComponent } from './social/social-form/social-form.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PresentIllnessComponent } from './present-illness/present-illness.component';
import { PresentIllnessFormComponent } from './present-illness/present-illness-form/present-illness-form.component';
import { PresentIllnessListComponent } from './present-illness/present-illness-list/present-illness-list.component';
import { PastMedicalFormComponent } from './past-medical/past-medical-form/past-medical-form.component';
import { PastMedicalComponent } from './past-medical/past-medical.component';
import { PastMedicalListComponent } from './past-medical/past-medical-list/past-medical-list.component';
import { FamilyComponent } from './family/family.component';
import { FamilyFormComponent } from './family/family-form/family-form.component';
import { FamilyListComponent } from './family/family-list/family-list.component';

@NgModule({
  declarations: [
    HistoriesComponent,
    SocialComponent,
    SocialListComponent,
    SocialFormComponent,
    PresentIllnessComponent,
    PresentIllnessFormComponent,
    PresentIllnessListComponent,
    PastMedicalComponent,
    PastMedicalFormComponent,
    PastMedicalListComponent,
    FamilyComponent,
    FamilyFormComponent,
    FamilyListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: HistoriesComponent }
    ])
  ]
})
export class HistoriesModule {}
