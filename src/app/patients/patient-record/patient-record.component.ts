import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styles: [`
  /* */
  .area {
    /*border: 1px solid rgba(0, 0, 0, .12);
    padding: 1em;*/
  }
  .header {
    text-align: right;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    padding-bottom: 1em;
  }
  .side {
    border-right: 1px solid rgba(0, 0, 0, .12);
  }
  .side > div > div:first-child {
    text-align: center;
  }
  .content {

  }
  .footer {

  }
  .action-button button {
    margin-left: 8px;
    text-align: right;
  }
  .fxRecord {
    margin-bottom: 1em;
  }
  .hide {
    display: none;
  }
  `]
})
export class PatientRecordComponent
extends SecureComponent
 implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private titleService: Title
    ) {
      super(authService, router, dialog, appconfig);
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
    const args = {
      width: '16%',
      id: patientId,
      dialogTitle: 'Generate QR Code',
      dialogButton: null
    };
    super.onPopup(args, QrCodeGenerateComponent);
  }

  viewChart(patientId) {
    const args = {
      width: '50%',
      id: patientId,
      dialogTitle: 'Chart',
      dialogButton: null
    };
    super.onPopup(args, PatientChartComponent);
  }

  onCancelVisit(patientId) {
    console.log(patientId);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
