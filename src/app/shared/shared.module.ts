import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { BirthdayPipe } from './pipes/birthday.pipe';

import { DrugsComponent } from './components/lookup/drugs/drugs.component';
import { PromptModule } from './components/prompt/prompt.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { HighchartsChartModule } from 'highcharts-angular';
import { AngularMaterialModule } from '../angular-material.module';
import { AreaComponent } from './components/widgets/area/area.component';
import { CardComponent } from './components/widgets/card/card.component';
import { PieComponent } from './components/widgets/pie/pie.component';
import { AdsComponent } from './components/ads/ads.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { UploadComponent } from './components/upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BirthdaysComponent } from './components/birthdays/birthdays.component';


@NgModule({
  declarations: [
    EllipsisPipe,
    BirthdayPipe,

    DrugsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AdsComponent,
    AvatarComponent,
    UploadComponent,
    BirthdaysComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    HighchartsChartModule
  ],
  exports: [
    PromptModule,
    // Pipes
    EllipsisPipe,
    BirthdayPipe,

    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AdsComponent,
    AvatarComponent,
    UploadComponent,
    BirthdaysComponent
  ]
})
export class SharedModule { }
