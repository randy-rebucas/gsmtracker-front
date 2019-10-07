import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from '../app-configuration.service';
import { PatientsService } from '../patients/patients.service';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../appointments/appointment.service';
import { QueService } from '../que/que.service';
import { NotificationService } from '../shared/notification.service';
import { DialogService } from '../shared/dialog.service';
import { EncountersService } from '../shared/encounters/encounters.service';
import { EncountersData } from '../shared/encounters/encounters-data.model';

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
    private patientsService: PatientsService,
    private appointmentService: AppointmentService,
    private queService: QueService,
    private encountersService: EncountersService

  ) {
    super(authService, router, dialog, appconfig);
   }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';

  public pieChartOptions = {
    responsive: true
  };

  ngOnInit() {
    super.doInit();

    this.titleService.setTitle('Home');

    this.patientsService.getAllNew(this.licenseId).subscribe((res) => {
      this.newPatient = res.count;
    });

    this.appointmentService.getAllNew(this.licenseId).subscribe((res) => {
      this.newAppointment = res.count;
    });

    this.newMessage = 3;
    this.canceledVisit = 1;

    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;

    // this.encountersService.getAll(this.licenseId);
    // this.encountersChartSub = this.encountersService
    // .getUpdateListener()
    // .subscribe((chartData: {encounters: EncountersData[], labels: []}) => {
    //     this.isLoading = false;
    //     console.log(chartData);
    //   });
    this.pieChartLabels = ['Success', 'Cancelled'];
    this.pieChartLegend = true;
    this.pieChartData = [120, 150];
    this.pieChartType = 'pie';

    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    this.barChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Cancelled'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Done'}
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
