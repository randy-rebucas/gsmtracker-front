import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import { ReplacePipe } from 'src/app/replace-pipe';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
      CommonModule,
      AngularMaterialModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [RecordComponent, ReplacePipe],
    exports: [RecordComponent]
})
export class RecordModule {}
