import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import {
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecordComponent
  ],
  exports: [
    RecordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RecordModule { }
