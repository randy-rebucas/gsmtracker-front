import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AccountComponent } from './account/account.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneralComponent } from './general/general.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
    GeneralComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      { path: '', component: SettingsComponent, children: [
        { path: '', redirectTo: 'general', pathMatch: 'full' },
        { path: 'general', component: GeneralComponent }
      ] }
    ])
  ]
})
export class SettingsModule { }
