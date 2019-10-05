import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ChiefComplaintComponent } from './chief-complaint.component';
import { ChiefComplaintListComponent } from './chief-complaint-list/chief-complaint-list.component';
import { ChiefComplaintEditComponent } from './chief-complaint-edit/chief-complaint-edit.component';
import { EndrosementComponent } from '../endorsement/endorsement.component';
import { EndorsementListComponent } from '../endorsement/endorsement-list/endorsement-list.component';
import { EndorsementFormComponent } from '../endorsement/endorsement-form/endorsement-form.component';

@NgModule({
  declarations: [
    ChiefComplaintComponent,
    ChiefComplaintListComponent,
    ChiefComplaintEditComponent,
    EndrosementComponent,
    EndorsementListComponent,
    EndorsementFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: ChiefComplaintComponent, children: [
        { path: '', component: ChiefComplaintListComponent }
      ] }
    ])
  ]
})
export class ChiefComplaintModule {}
