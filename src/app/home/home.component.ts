import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../appointments/appointment.service';
import { QueService } from '../que/que.service';
import { NotificationService } from '../shared/notification.service';
import { DialogService } from '../shared/dialog.service';
import { EncountersService } from '../shared/encounters/encounters.service';
import { EncountersData } from '../shared/encounters/encounters-data.model';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
  mat-grid-tile.grid-content>::ng-deep .mat-figure {
    align-items: flex-start;
  }
  mat-grid-tile.grid-content>::ng-deep .mat-figure h1 {
    text-align: center;
  }
  .mat-grid-tile {
    border: 1px solid rgba(0, 0, 0, .12);
  }
  .mb-20 {
    margin-bottom: 1em;
  }
  canvas.chartjs-render-monitor {
    /*opacity: .2;*/
  }
  .grid-inner-content.grid-inner-content-list.chart h1 {
    position: absolute;
    top: 28%;
    left: 45%;
  }
  mat-grid-tile-header.mat-grid-tile-header .action-button {
    position: absolute;
    right: 0;
  }
  .action-button {
    text-align: right;
  }
  `]
})
export class HomeComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @Input() title: string;

  newPatient: number;
  newAppointment: number;
  newMessage: number;
  canceledVisit: number;
  breakpoint: number;

  private encountersChartSub: Subscription;
  public barChartData: any;
  public barChartLabels: any;
  public barChartType: string;
  public barChartLegend: boolean;

  public pieChartLabels: any;
  public pieChartLegend: boolean;
  public pieChartData: any;
  public pieChartType: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    private dialogService: DialogService,
    private titleService: Title,
    private usersService: UsersService,
    private appointmentService: AppointmentService,
    private queService: QueService,
    private encountersService: EncountersService,
    private messagesService: MessagesService

  ) {
    super(authService, router, dialog, appconfig);

    this.canceledVisit = 0;
   }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public pieChartOptions = {
    responsive: true
  };

  years = [];
  canceled = [];
  done = [];

  ngOnInit() {
    super.doInit();

    this.titleService.setTitle('Home');
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    this.usersService.getAllNew(this.licenseId).subscribe((res) => {
      this.newPatient = (res.count) ? res.count : 0;
    });

    this.appointmentService.getAllNew(this.licenseId).subscribe((res) => {
      this.newAppointment = (res.count) ? res.count : 0;
    });

    this.messagesService.getAllUnread(this.licenseId).subscribe((res) => {
      this.newMessage = (res.count) ? res.count : 0;
    });

    this.encountersService.getAll(this.licenseId);
    this.encountersChartSub = this.encountersService
    .getUpdateListener()
    .subscribe((chartData: {encounters: EncountersData[]}) => {
        this.isLoading = false;
        for (const encounter of chartData.encounters) {
          this.years.push(encounter.label);
          this.canceled.push(encounter.canceled);
          this.done.push(encounter.done);
          this.canceledVisit = encounter.canceled;
        }
    });

    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartLabels = this.years;
    this.barChartData = [
      {data: this.canceled, label: 'Cancelled'},
      {data: this.done, label: 'Done'}
    ];
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }

  onClear() {
    this.queService.clear(this.licenseId);
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.queService.clear(this.licenseId).subscribe(() => {
          this.queService.getAll(this.licenseId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  onOpen() {
    window.open('/que', '_blank');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
