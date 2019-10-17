import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProgressNotesComponent } from './progress-notes.component';
import { ProgressNoteListComponent } from './progress-note-list/progress-note-list.component';
import { ProgressNoteEditComponent } from './progress-note-edit/progress-note-edit.component';


@NgModule({
  declarations: [
    ProgressNotesComponent,
    ProgressNoteListComponent,
    ProgressNoteEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PerfectScrollbarModule,
    EditorModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
       { path: '', component: ProgressNotesComponent }
    ])
  ]
})
export class ProgressNotesModule {}
