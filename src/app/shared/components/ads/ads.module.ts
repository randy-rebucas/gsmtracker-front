import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsComponent } from './ads.component';



@NgModule({
  declarations: [
    AdsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ AdsComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdsModule { }
