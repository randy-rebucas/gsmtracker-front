import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysiciansComponent } from './physicians.component';



@NgModule({
  declarations: [
    PhysiciansComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ PhysiciansComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PhysiciansModule { }
