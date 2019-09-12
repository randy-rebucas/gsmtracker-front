import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent
extends SecureComponent
 implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private titleService: Title
    ) {
      super(authService, router, dialog);
    }

  ngOnInit() {
    super.doInit();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.patientId = paramMap.get('patientId');
    });

    this.getPatientData(this.patientId)
      .then((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Record');

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
    const patientResponse = await this.patientsService.get(patientId).toPromise();
    return {
      patientData: patientResponse
    };
  }

  generateQrCode(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '16%';
    dialogConfig.data = {
      id: patientId,
      title: 'Generate QR Code'
    };
    this.dialog.open(QrCodeGenerateComponent, dialogConfig);
  }

  viewChart(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: patientId,
        title: 'Chart'
      };
    this.dialog.open(PatientChartComponent, dialogConfig);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
