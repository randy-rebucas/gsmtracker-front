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
import { AppointmentData } from '../appointment-data.model';
import { AppointmentService } from '../appointment.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AppointmentDetailComponent } from '../appointment-detail/appointment-detail.component';

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

  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public appointmentService: AppointmentService,
    private dialog: MatDialog
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
      });
  }

  viewEvent(arg) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: arg.event.id
    };
    this.dialog.open(AppointmentDetailComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
