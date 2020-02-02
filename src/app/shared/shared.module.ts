import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { AdsModule } from './components/ads/ads.module';
import { AvatarModule } from './components/avatar/avatar.module';
import { EventsModule } from './components/events/events.module';
import { CalendarModule } from './components/calendar/calendar.module';
import { BirthdaysModule } from './components/birthdays/birthdays.module';
import { BirthdayPipe } from './pipes/birthday.pipe';
import { PhysiciansModule } from './components/physicians/physicians.module';
import { UploadModule } from './components/upload/upload.module';


@NgModule({
  declarations: [
    EllipsisPipe,
    BirthdayPipe
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
    // Pipes
    EllipsisPipe,
    BirthdayPipe,
  ]
})
export class SharedModule { }
