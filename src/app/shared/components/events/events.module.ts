import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { MatIconModule, MatListModule } from '@angular/material';

@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule
  ],
  exports: [ EventsComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EventsModule { }
