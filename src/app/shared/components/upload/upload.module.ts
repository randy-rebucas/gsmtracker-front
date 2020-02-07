import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AvatarModule } from '../avatar/avatar.module';




@NgModule({
  declarations: [
    UploadComponent
  ],
  exports: [ UploadComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    AvatarModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UploadModule { }
