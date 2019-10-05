import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from 'src/app/auth/auth-guard';
import { EncountersComponent } from './encounters.component';
import { EncounterListComponent } from './encounter-list/encounter-list.component';
import { EncounterFormComponent } from './encounter-form/encounter-form.component';


@NgModule({
  declarations: [
    EncountersComponent,
    EncounterListComponent,
    EncounterFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      {
        path: '', component: EncountersComponent, canActivate: [AuthGuard], children: [
          { path: '', component: EncounterListComponent },
          { path: ':encounterId', component: EncounterFormComponent }
        ]
      }
    ])
  ]
})
export class EncountersModule {}
