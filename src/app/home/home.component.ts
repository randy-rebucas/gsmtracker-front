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

  private patientsChartSub: Subscription;
  public barChartData: any;
  public barChartLabels: any;
  public barChartType: string;
  public barChartLegend: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private titleService: Title,
    private patientsService: PatientsService,
    private appointmentService: AppointmentService
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

  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartData = [120, 150, 180, 90];
  public pieChartType = 'pie';

  ngOnInit() {
    super.doInit();
    if (!this.userIsAuthenticated) {
      this.router.navigate(['/auth/login']);
    }

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


    // this.patientsService.getAllPatientByYear(this.licenseId);
    // this.patientsChartSub = this.patientsService
    // .getUpdateListener()
    // .subscribe((patientData: {patients: PatientData[], patientCount: number}) => {
      //   this.isLoading = false;
      //   this.total = patientData.patientCount;
      //   this.dataSource = new MatTableDataSource(patientData.patients);
      //   this.dataSource.paginator = this.paginator;
      //   this.dataSource.sort = this.sort;
      // });

    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    this.barChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
