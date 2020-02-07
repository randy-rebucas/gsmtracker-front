import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysiciansComponent } from './physicians.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PhysicianWidgetComponent } from './physician-widget/physician-widget.component';



@NgModule({
  declarations: [
    PhysiciansComponent,
    PhysicianWidgetComponent
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
