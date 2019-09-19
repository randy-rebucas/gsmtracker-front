import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HeightService } from '../patient-record/services/height.service';
import { WeightService } from '../patient-record/services/weight.service';
import { TemperatureService } from '../patient-record/services/temperature.service';
import { BpService } from '../patient-record/services/bp.service';
import { RprService } from '../patient-record/services/rpr.service';
import { HistoryService } from '../patient-record/services/history.service';
import { ComplaintService } from '../patient-record/services/complaint.service';
import { AssessmentService } from '../patient-record/services/assessment.service';
import { PrescriptionService } from '../patient-record/services/prescription.service';
import { NotesService } from '../patient-record/services/notes.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

import { ProfileImageComponent } from 'src/app/upload/profile-image/profile-image.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  height: number;
  heightCreated = new Date();

  weight: number;
  weightCreated = new Date();

  temperature: number;
  temperatureCreated = new Date();

  tempSystolic: number;
  tempDiastolic: number;
  tempCreated = new Date();

  respiratoryRate: number;
  respiratoryRateCreated = new Date();

  histories: any;
  complaints: any;
  assessments: any;
  diagnosis: any;
  treatments: any;
  prescriptions: any;
  progressNotes: string;

  files: UploadData[] = [];

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private route: ActivatedRoute,
    private titleService: Title,
    public patientsService: PatientsService,
    public heightService: HeightService,
    public weightService: WeightService,
    public temperatureService: TemperatureService,
    public bpService: BpService,
    public rprService: RprService,
    public historyService: HistoryService,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    public uploadService: UploadService
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
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Detail');

        // this.id = results.patientData._id;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;

        if (Object.keys(results.heightData).length) {
          this.height = results.heightData[0].height;
          this.heightCreated = results.heightData[0].created;
        }

        if (Object.keys(results.weightData).length) {
          this.weight = results.weightData[0].weight;
          this.weightCreated = results.weightData[0].created;
        }

        if (Object.keys(results.temperatureData).length) {
          this.temperature = results.temperatureData[0].temperature;
          this.temperatureCreated = results.temperatureData[0].created;
        }

        if (Object.keys(results.bloodPressureData).length) {
          this.tempSystolic = results.bloodPressureData[0].systolic;
          this.tempDiastolic = results.bloodPressureData[0].diastolic;
          this.tempCreated = results.bloodPressureData[0].created;
        }

        if (Object.keys(results.respiratoryRateData).length) {
          this.respiratoryRate = results.respiratoryRateData[0].respiratoryrate;
          this.respiratoryRateCreated = results.respiratoryRateData[0].created;
        }

        if (Object.keys(results.historyData).length) {
          this.histories = results.historyData;
        }

        if (Object.keys(results.complaintData).length) {
          this.complaints = results.complaintData[0].complaints;
        }

        if (Object.keys(results.assessmentData).length) {
          this.diagnosis = results.assessmentData[0].diagnosis;
          this.treatments = results.assessmentData[0].treatments;
        }

        if (Object.keys(results.prescriptionData).length) {
          this.prescriptions = results.prescriptionData[0].prescriptions;
        }

        if (Object.keys(results.progressNotesData).length) {
          this.progressNotes = results.progressNotesData[0].note;
        }
      })
      .catch(err => console.log(err));

    }

    async getPatientData(patientId) {
      const patientResponse = await this.patientsService.get(patientId).toPromise();
      const heightResponse = await this.heightService.getLast(patientId).toPromise();
      const weightResponse = await this.weightService.getLast(patientId).toPromise();
      const temperatureResponse = await this.temperatureService.getLast(patientId).toPromise();
      const bloodPressureResponse = await this.bpService.getLast(patientId).toPromise();
      const respiratoryRateResponse = await this.rprService.getLast(patientId).toPromise();
      const historyResponse = await this.historyService.getLast(patientId).toPromise();
      const complaintResponse = await this.complaintService.getLast(patientId).toPromise();
      const assessmentResponse = await this.assessmentService.getLast(patientId).toPromise();
      const prescriptionResponse = await this.prescriptionService.getLast(patientId).toPromise();
      const progressNotesResponse = await this.notesService.getLast(patientId).toPromise();
      return {
        patientData: patientResponse,
        heightData: heightResponse,
        weightData: weightResponse,
        temperatureData: temperatureResponse,
        bloodPressureData: bloodPressureResponse,
        respiratoryRateData: respiratoryRateResponse,
        historyData: historyResponse,
        complaintData: complaintResponse,
        assessmentData: assessmentResponse,
        prescriptionData: prescriptionResponse,
        progressNotesData: progressNotesResponse
      };
    }

    onPictureChange() {
      const args = {
        width: '30%',
        id: this.patientId,
        dialogTitle: 'Edit photo',
        dialogButton: 'Save'
      };
      super.onPopup(args, ProfileImageComponent);
    }

    onViewAll(targetComp: any) {
      switch (targetComp) {
        case 'height':
          this.router.navigate(['./record/physical-exams/height'], {relativeTo: this.route});
          break;
        case 'weight':
          this.router.navigate(['./record/physical-exams/weight'], {relativeTo: this.route});
          break;
        case 'temperature':
          this.router.navigate(['./record/physical-exams/temperature'], {relativeTo: this.route});
          break;
        case 'blood-pressure':
          this.router.navigate(['./record/physical-exams/blood-pressure'], {relativeTo: this.route});
          break;
        case 'respiratory-rate':
          this.router.navigate(['./record/physical-exams/respiratory-rate'], {relativeTo: this.route});
          break;
        case 'histories':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'chief-complaints':
          this.router.navigate(['./record/chief-complaints'], {relativeTo: this.route});
          break;
        case 'assessments':
          this.router.navigate(['./record/assessments'], {relativeTo: this.route});
          break;
        case 'prescriptions':
          this.router.navigate(['./record/prescriptions'], {relativeTo: this.route});
          break;
        case 'progress-notes':
          this.router.navigate(['./record/progress-notes'], {relativeTo: this.route});
          break;
        case 'test-results':
          this.router.navigate(['./record/test-results'], {relativeTo: this.route});
          break;
        default:
          this.router.navigate(['./'], {relativeTo: this.route});
      }
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

    gotoRecord() {
      this.router.navigate(['./record/physical-exams'], {relativeTo: this.route});
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
