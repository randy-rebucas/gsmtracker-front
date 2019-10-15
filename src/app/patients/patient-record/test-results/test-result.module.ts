import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadModule } from 'src/app/upload/upload.module';

import { TestResultsComponent } from './test-results.component';
import { TestResultListComponent } from './test-result-list/test-result-list.component';
import { TestResultDetailComponent } from './test-result-detail/test-result-detail.component';
import { TestResultGridComponent } from './test-result-grid/test-result-grid.component';
import { UcWidgetModule } from 'ngx-uploadcare-widget';


@NgModule({
  declarations: [
    TestResultsComponent,
    TestResultListComponent,
    TestResultDetailComponent,
    TestResultGridComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    UploadModule,
    UcWidgetModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: TestResultsComponent, children: [
        { path: '', component: TestResultListComponent },
        { path: ':fileId', component: TestResultDetailComponent }
      ] }
   ])
  ]
})
export class TestResultModule {}
