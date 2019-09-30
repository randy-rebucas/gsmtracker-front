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
import { NetworksService } from 'src/app/networks/networks.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { QueService } from 'src/app/que/que.service';
import { UsersService } from 'src/app/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../patient-edit/mime-type.validator';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
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
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card {
    border-radius: 0;
  }
  .fxRecord {
    margin-bottom: 1em;
  }
  .fxRecord.hasMinHeight mat-card {
    min-height: 142px;
  }
  .hide {
    display: none;
  }
  .image-preview {
    position: relative;
  }
  .image-preview button {
    position: absolute;
    right: 8px;
    visibility: hidden;
  }
  .image-preview:hover button {
    visibility: visible;
  }
  .image-preview img {
    width: 100%;
  }
  .icon-wrap {
    position: relative;
  }
  .icon-wrap span {
    position: absolute;
    left: 2em;
    top: 3px;
    font-weight: 600;
  }
  .mat-h2, .mat-title, .mat-typography h2 {
    margin: unset;
}
`]
})
export class PatientDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {
  perscriptionColumns: string[] = ['maintenable', 'medicine', 'preparation', 'sig', 'qty'];

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

  created: Date;
  email: string;
  userType: string;
  avatar: string;
  metas: [];
  queNumber: number;

  selectedFile: File = null;
  imagePreview: string;
  profileForm: FormGroup;

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private route: ActivatedRoute,
    private titleService: Title,
    public patientsService: PatientsService,
    private usersService: UsersService,
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
    public uploadService: UploadService,
    public networksService: NetworksService,
    private notificationService: NotificationService,
    private queService: QueService
    ) {
      super(authService, router, dialog, appconfig);
    }

    ngOnInit() {
      super.doInit();

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.patientId = paramMap.get('patientId');
      });
      this.profileForm = new FormGroup({
        profilePicture: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })
      });

      this.getPatientData(this.patientId)
      .then((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Detail');
        this.personId = results.patientData.personId;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;
        this.addresses = results.patientData.addresses;
        this.created = results.patientData.created;
        this.email = results.patientData.email;
        this.userType = results.patientData.userType;
        this.metas = results.patientData.meta;
        this.avatar = results.patientData.avatar;

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
      const patientResponse = await this.usersService.get(patientId).toPromise();
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

    onFileChanged(event: Event) {
      this.selectedFile = (event.target as HTMLInputElement).files[0];
      this.profileForm.patchValue({ profilePicture: this.selectedFile });
      this.profileForm.get('profilePicture').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.avatar = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      this.onSavePicture();
    }

    onSavePicture() {
      this.usersService.upload(
        this.patientId,
        this.userType,
        this.profileForm.value.profilePicture
      ).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('upload progress: ' + Math.round(event.loaded / event.total * 100) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log(event); // handle event here
        }
        this.notificationService.success(':: profile picture updated successfully');
      });
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
      this.router.navigate(['./record/chief-complaints'], {relativeTo: this.route});
    }

    moveToQue(patientId) {
      this.queService.insert(patientId, this.licenseId).subscribe((res) => {
        this.notificationService.success(':: on que done. #' + res.que.queNumber);
      });
    }

    async addToNetwork(requesterId) {
      const network = await this.networksService.insert(requesterId, this.userId).toPromise();
      this.notificationService.success(':: request sent');
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
