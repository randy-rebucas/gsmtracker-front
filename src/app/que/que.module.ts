import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuard } from 'src/app/auth/auth-guard';
import { QueComponent } from './que.component';
import { QueListComponent } from './que-list/que-list.component';


@NgModule({
  declarations: [
    QueComponent,
    QueListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    RouterModule.forChild([
      {
        path: '', component: QueListComponent
      }
    ])
  ]
})
export class QueModule {}
