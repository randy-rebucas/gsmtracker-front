import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { BirthdayPipe } from './pipes/birthday.pipe';

import { DrugsComponent } from './components/lookup/drugs/drugs.component';
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
import { HelpComponent } from './components/help/help.component';
import { SettingComponent } from './components/setting/setting.component';
import { ImportComponent } from './components/import/import.component';
import { PhysicianComponent } from './components/physician/physician.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { PrescriptionComponent } from './components/prescription/prescription.component';
import { QrWriterComponent } from './components/qr-writer/qr-writer.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ProfileComponent } from './components/profile/profile.component';
import { LabelComponent } from './components/label/label.component';
import { ItemsComponent } from './components/label/items/items.component';
import { QrReaderComponent } from './components/qr-reader/qr-reader.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadgeModule } from '@angular/material/badge';
import { PromptComponent } from './components/prompt/prompt.component';

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
    BirthdaysComponent,
    HelpComponent,
    SettingComponent,
    ImportComponent,
    PhysicianComponent,
    BlocksComponent,
    PrescriptionComponent,
    QrWriterComponent,
    ProfileComponent,
    LabelComponent,
    ItemsComponent,
    QrReaderComponent,
    PromptComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    HighchartsChartModule,
    PerfectScrollbarModule,
    QRCodeModule,
    ZXingScannerModule,
    MatBadgeModule
  ],
  exports: [
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
    BirthdaysComponent,
    PhysicianComponent,
    BlocksComponent,
    PrescriptionComponent,
    QrWriterComponent,
    ProfileComponent,
    LabelComponent,
    ItemsComponent,
    PromptComponent
  ]
})
export class SharedModule { }
