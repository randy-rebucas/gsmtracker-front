import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RepairListComponent } from './repair-list/repair-list.component';
import { RepairFormComponent } from './repair-form/repair-form.component';
import { RepairsComponent } from './repairs.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [
    RepairsComponent,
    RepairListComponent,
    RepairFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
    FlexLayoutModule,
    EditorModule,
    RouterModule.forChild([
      { path: '', component: RepairsComponent, children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: RepairListComponent },
        { path: 'list', component: RepairListComponent },
        { path: 'form', component: RepairFormComponent },
        { path: ':repairId', component: RepairListComponent },
      ] }
    ])
  ],
  providers: [DatePipe],
  entryComponents: [
    RepairFormComponent
  ]
})
export class RepairsModule { }
