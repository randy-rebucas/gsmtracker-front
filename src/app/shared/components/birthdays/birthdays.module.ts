import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdaysComponent } from './birthdays.component';
import { MatListModule, MatCardModule } from '@angular/material';


@NgModule({
  declarations: [
    BirthdaysComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule
  ],
  exports: [ BirthdaysComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class BirthdaysModule { }
