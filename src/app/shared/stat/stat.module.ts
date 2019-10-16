import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatComponent } from './stat.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
@NgModule({
    imports: [
      CommonModule,
      AngularMaterialModule
    ],
    declarations: [StatComponent],
    exports: [StatComponent]
})
export class StatModule {}
