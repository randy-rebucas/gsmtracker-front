import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadModule } from 'src/app/upload/upload.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    UploadModule,
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TestResultModule {}
