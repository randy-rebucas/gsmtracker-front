import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import { AppointmentData } from '../appointment-data.model';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.css']
})
export class AppointmentCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  userId: string;
  total = 0;
  perPage = 10;
  currentPage = 1;
  isLoading = false;
  appointments: AppointmentData[] = [];
  // AIzaSyAG6XBWVT7fFU1newS7FUz9S8LsSb1h9bs
  // https://calendar.google.com/calendar?cid=cmVidWNhc3JhbmR5MTk4NkBnbWFpbC5jb20
  // calendar id: rebucasrandy1986@gmail.com

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, listPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date(), end: new Date() }
  ];

  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public appointmentService: AppointmentService,
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);

    this.recordsSub = this.appointmentService
      .getUpdateListener()
      .subscribe((appointmentData: {appointments: AppointmentData[], count: number}) => {
        this.isLoading = false;
        this.total = appointmentData.count;
        this.appointments = appointmentData.appointments;
        console.log(appointmentData.appointments);
      });
  }

  handleDateClick(arg) {
    console.log(arg);
  }

  viewEvent(arg) {
    console.log(arg.event.title); // good
    console.log(arg.event);
  }

  viewShort(arg) {
    console.log(arg);

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
