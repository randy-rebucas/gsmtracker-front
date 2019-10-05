import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ChiefComplaintRoutingModule } from './chief-complaint.routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    EditorModule,
    PerfectScrollbarModule,
    ChiefComplaintRoutingModule,
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ]
})
export class ChiefComplaintModule {}
