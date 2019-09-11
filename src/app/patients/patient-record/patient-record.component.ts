import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { MessageEditComponent } from 'src/app/messages/message-edit/message-edit.component';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  id: string;
  bloodType: string;
  firstname: string;
  midlename: string;
  lastname: string;
  fullname: string;
  contact: string;
  gender: string;
  birthdate: string;
  image: string;

  isLoading = false;
  private patientId: string;

  constructor(
    private authService: AuthService,
    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.patientId = paramMap.get('patientId');
    });

    this.getPatientData(this.patientId)
      .then((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Record');

        this.id = results.patientData._id;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;
        this.bloodType = results.patientData.bloodType;
      })
      .catch(err => console.log(err));
  }

  async getPatientData(patientId) {
    const patientResponse = await this.patientsService.getPatient(patientId).toPromise();
    return {
      patientData: patientResponse
    };
  }

  generateQrCode() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '16%';
    dialogConfig.data = {
      id: null,
      title: 'Generate QR Code',
      patientId: this.patientId
    };
    this.dialog.open(QrCodeGenerateComponent, dialogConfig);
  }

  viewChart() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: null,
        title: 'Chart',
        patientId: this.patientId
      };
    this.dialog.open(PatientChartComponent, dialogConfig);
  }

  onCreateMessage() {
    this.router.navigate(['messages']);
  }

  onCreateAppointment() {
    this.router.navigate(['appointments']);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
