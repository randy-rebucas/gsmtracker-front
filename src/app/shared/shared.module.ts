import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { AdsModule } from './components/ads/ads.module';
import { AvatarModule } from './components/avatar/avatar.module';
import { EventsModule } from './components/events/events.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { BirthdaysModule } from './components/birthdays/birthdays.module';
import { BirthdayPipe } from './pipes/birthday.pipe';
import { PhysiciansModule } from '../modules/secure/user/physicians/physicians.module';
import { UploadModule } from './components/upload/upload.module';
import { RecordModule } from './components/record/record.module';
import { DrugsComponent } from './components/lookup/drugs/drugs.component';
import { PromptModule } from './components/prompt/prompt.module';


@NgModule({
  declarations: [
    EllipsisPipe,
    BirthdayPipe,
    DrugsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AdsModule,
    AvatarModule,
    EventsModule,
    CalendarModule,
    BirthdaysModule,
    PhysiciansModule,
    UploadModule,
    RecordModule,
    PromptModule,
    // Pipes
    EllipsisPipe,
    BirthdayPipe,
  ]
})
export class SharedModule { }
