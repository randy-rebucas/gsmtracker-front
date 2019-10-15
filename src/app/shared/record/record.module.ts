import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordComponent } from './record.component';
import { ReplacePipe } from 'src/app/replace-pipe';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LightboxModule } from 'ngx-lightbox';
import { UcWidgetModule } from 'ngx-uploadcare-widget';

@NgModule({
    imports: [
      CommonModule,
      AngularMaterialModule,
      LightboxModule,
      UcWidgetModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [RecordComponent, ReplacePipe],
    exports: [RecordComponent]
})
export class RecordModule {}
