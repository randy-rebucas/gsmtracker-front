import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysiciansComponent } from './physicians.component';
import { MatListModule } from '@angular/material';



@NgModule({
  declarations: [
    PhysiciansComponent
  ],
  imports: [
    CommonModule,
    MatListModule
  ],
  exports: [ PhysiciansComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PhysiciansModule { }
