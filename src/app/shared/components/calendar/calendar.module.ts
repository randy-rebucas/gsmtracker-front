import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ CalendarComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CalendarModule { }
