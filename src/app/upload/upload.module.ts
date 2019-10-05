import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ],
  declarations: [UploadComponent],
  exports: [UploadComponent]
})
export class UploadModule {}
