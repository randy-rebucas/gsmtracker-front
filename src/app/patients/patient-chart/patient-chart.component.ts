import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

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
import { PatientsService } from '../patients.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SecureComponent } from 'src/app/secure/secure.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-chart',
  templateUrl: './patient-chart.component.html',
  styleUrls: ['./patient-chart.component.css']
})
export class PatientChartComponent
extends SecureComponent
implements OnInit, OnDestroy {

  @ViewChild('content', {static: false}) content: ElementRef;

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
  prescriptions: [];
  progressNotes: string;

  dialogTitle: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

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
    public dialogRef: MatDialogRef < PatientChartComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog);
      this.dialogTitle = data.title;
      this.patientId = data.id;
     }

  ngOnInit() {
    super.doInit();

    this.getPatientData(this.patientId)
      .then((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Chart');

        // this.id = results.patientData._id;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;
        this.bloodType = results.patientData.bloodType;

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

  public downloadChart() {

    const content = this.content.nativeElement;

    html2canvas(content).then(canvas => {

      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');

      const pdfDoc = new jsPDF();

      const margins = {
        top: 15,
        bottom: 15,
        left: 15,
        width: 190
      };

      const position = 0;

      const specialElementHandlers = {
        '#editor': (element: any, renderer: any) => {
          return true;
        }
      };

      pdfDoc.fromHTML(content.innerHTML, margins.left, margins.top, {
        width: margins.width,
        elementHandlers: specialElementHandlers
      });

      pdfDoc.setProperties({
        title: 'Record Chart',
        subject: 'Randy Rebucas Record Chart',
        author: 'Clinic+',
        keywords: 'patient chart',
        creator: 'Clinic+'
      });

      pdfDoc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdfDoc.save('record.pdf');
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
