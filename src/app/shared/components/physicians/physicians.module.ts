import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysiciansComponent } from './physicians.component';
import { MatListModule, MatIconModule } from '@angular/material';



@NgModule({
  declarations: [
    PhysiciansComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule
  ],
  exports: [ PhysiciansComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PhysiciansModule { }
