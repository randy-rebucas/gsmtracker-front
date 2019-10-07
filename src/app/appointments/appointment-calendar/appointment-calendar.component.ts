import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AppointmentData } from '../appointment-data.model';
import { AppointmentService } from '../appointment.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AppointmentDetailComponent } from '../appointment-detail/appointment-detail.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styles: [`
  .fc-view-container {
    z-index: -1 !important;
  }
`]
})
export class AppointmentCalendarComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  appointments: AppointmentData[] = [];
  // AIzaSyAG6XBWVT7fFU1newS7FUz9S8LsSb1h9bs
  // https://calendar.google.com/calendar?cid=cmVidWNhc3JhbmR5MTk4NkBnbWFpbC5jb20
  // calendar id: rebucasrandy1986@gmail.com

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, listPlugin, interactionPlugin];
  calendarWeekends = true;
  timeZone: 'UTC';

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public appointmentService: AppointmentService,
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.appointmentService.getAll(this.licenseId, this.perPage, this.currentPage);
    this.recordsSub = this.appointmentService
      .getUpdateListener()
      .subscribe((appointmentData: {appointments: AppointmentData[], count: number}) => {
        this.isLoading = false;
        this.total = appointmentData.count;
        this.appointments = appointmentData.appointments;
      });
  }

  viewEvent(arg) {
    const args = {
      width: '30%',
      id: arg.event.id,
      dialogTitle: 'Update Patient',
      dialogButton: 'Update'
    };
    super.onPopup(args, AppointmentDetailComponent);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
