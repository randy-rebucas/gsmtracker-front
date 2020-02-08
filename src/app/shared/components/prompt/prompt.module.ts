import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptComponent } from './prompt.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    PromptComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [ PromptComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    PromptComponent
  ],
})
export class PromptModule { }
