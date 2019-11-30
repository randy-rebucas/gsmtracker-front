import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecordsComponent } from './records.component';
import { RouterModule } from '@angular/router';
import { AdsComponent } from 'src/app/shared/components/ads/ads.component';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';



@NgModule({
  declarations: [
    RecordsComponent,
    AdsComponent,
    // UploadComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: RecordsComponent }
    ])
  ]
})
export class RecordsModule { }
