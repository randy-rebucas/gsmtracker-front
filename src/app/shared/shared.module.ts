import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { BirthdayPipe } from './pipes/birthday.pipe';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { AngularMaterialModule } from '../angular-material.module';
import { AvatarComponent } from './components/avatar/avatar.component';
import { UploadComponent } from './components/upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingComponent } from './components/setting/setting.component';
import { ImportComponent } from './components/import/import.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ProfileComponent } from './components/profile/profile.component';
import { LabelComponent } from './components/label/label.component';
import { ItemsComponent } from './components/label/items/items.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadgeModule } from '@angular/material/badge';
import { PromptComponent } from './components/prompt/prompt.component';
import { ExportComponent } from './components/export/export.component';
import { PrintComponent } from './components/print/print.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    EllipsisPipe,
    BirthdayPipe,

    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AvatarComponent,
    UploadComponent,
    SettingComponent,
    ImportComponent,
    ProfileComponent,
    LabelComponent,
    ItemsComponent,
    PromptComponent,
    ExportComponent,
    PrintComponent
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
    PerfectScrollbarModule,
    QRCodeModule,
    MatBadgeModule,
    ClipboardModule
  ],
  exports: [
    // Pipes
    EllipsisPipe,
    BirthdayPipe,

    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AvatarComponent,
    UploadComponent,
    ProfileComponent,
    LabelComponent,
    ItemsComponent,
    PromptComponent,
    ExportComponent,
    PrintComponent
  ],
  providers: [DatePipe, CurrencyPipe]
})
export class SharedModule { }
