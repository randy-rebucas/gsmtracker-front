import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecordsComponent } from './records.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatCheckboxModule,
  MatGridListModule,
  MatMenuModule
} from '@angular/material';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { RecordModule } from 'src/app/shared/components/record/record.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AdsModule } from 'src/app/shared/components/ads/ads.module';
import { UploadModule } from 'src/app/shared/components/upload/upload.module';

@NgModule({
  declarations: [
    RecordsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCheckboxModule,
    MatMenuModule,
    AvatarModule,
    AdsModule,
    UploadModule,
    RecordModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: RecordsComponent }
    ])
  ]
})
export class RecordsModule { }
