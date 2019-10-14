import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
// import { HeightService } from '../patient-record/services/height.service';
// import { WeightService } from '../patient-record/services/weight.service';
// import { TemperatureService } from '../patient-record/services/temperature.service';
// import { BpService } from '../patient-record/services/bp.service';
// import { RprService } from '../patient-record/services/rpr.service';
// import { HistoryService } from '../patient-record/services/history.service';
// import { ComplaintService } from '../patient-record/services/complaint.service';
// import { AssessmentService } from '../patient-record/services/assessment.service';
// import { PrescriptionService } from '../patient-record/services/prescription.service';
// import { NotesService } from '../patient-record/services/notes.service';
// import { UploadService } from 'src/app/upload/upload.service';
// import { UploadData } from 'src/app/upload/upload-data.model';

import { NetworksService } from 'src/app/networks/networks.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { QueService } from 'src/app/que/que.service';
import { UsersService } from 'src/app/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../patient-edit/mime-type.validator';
import { HttpEventType } from '@angular/common/http';
import { EncountersService } from 'src/app/shared/encounters/encounters.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styles: [`
  /* */
  .area {
    position: relative;
  }
  .header {

  }
  .area.side,
  .area.content {
    min-height: 700px;
  }
  .side {

  }
  .side > div > div:first-child {

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
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
    width: 100%;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card {
    border-radius: 0;
  }
  .fxRecord.hasMinHeight mat-card {
    min-height: 142px;
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
  /** */
  .patient-detail {
    display: flex;
    flex-direction: row;
    /*border: 1px solid;*/
  }
  .patient-detail > div {
    flex: 0 1 auto;
    /*border: 1px solid red;*/
    margin: .1em;
  }
  .patient-detail > div:last-child {
    width: 100%;
    margin-left: 1em;
  }
  .patient-detail > div > div {
    /*border: 1px solid blue;*/
  }
  .patient-detail > div > div:first-child {
    align-self: flex-start;
  }
  .patient-detail > div > div:last-child {
    align-self: flex-end;
    margin-top: 1em;
  }
  .patient-detail > div > div:last-child a {
    margin-right: 10px;
  }
  .patient-detail > div > div > div {
    display: flex;
  }
  .patient-detail > div > div > div:last-child {
    display: flex;
  }
  .patient-detail > div > div > div > div:last-child {
    flex-grow: 1;
    text-align: right;
  }
  .patient-detail > div > div > div > div dl {
    margin: 0;
    padding-left: 1em;
  }
  .patient-detail > div > div > div > div dt {
      float: left;
  }
  .patient-detail > div > div > div > div dd {
    padding-left: 3em;
  }

  .mat-card-title {
    font-size: 14px;
  }
`]
})
export class PatientDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  // perscriptionColumns: string[] = ['maintenable', 'medicine', 'preparation', 'sig', 'qty'];

  // height: number;
  // heightCreated = new Date();

  // weight: number;
  // weightCreated = new Date();

  // temperature: number;
  // temperatureCreated = new Date();

  // tempSystolic: number;
  // tempDiastolic: number;
  // tempCreated = new Date();

  // respiratoryRate: number;
  // respiratoryRateCreated = new Date();

  // histories: any;
  // complaints: any;
  // assessments: any;
  // diagnosis: any;
  // treatments: any;
  // prescriptions: any;
  // progressNotes: string;

  // files: UploadData[] = [];

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
  public isOnQue: boolean;
  isLoadingPic = false;
  bufferValue: number;
  color: string;
  mode: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private route: ActivatedRoute,
    private titleService: Title,
    public patientsService: PatientsService,
    private usersService: UsersService,
    public networksService: NetworksService,
    private notificationService: NotificationService,
    private queService: QueService,
    private encountersService: EncountersService
    ) {
      super(authService, router, dialog, appconfig);
    }

    ngOnInit() {
      super.doInit();

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.patientId = paramMap.get('userId');
      });

      this.queService.get(this.patientId).subscribe((res) => {
        this.isOnQue = res.onQue;
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
      })
      .catch(err => console.log(err));

    }

    async getPatientData(patientId) {
      const patientResponse = await this.usersService.get(patientId).toPromise();
      return {
        patientData: patientResponse,
      };
    }

    onFileChanged(event: Event) {
      this.selectedFile = (event.target as HTMLInputElement).files[0];
      this.profileForm.patchValue({ profilePicture: this.selectedFile });
      this.isLoadingPic = true;
      this.onSavePicture();
    }

    onSavePicture() {
      this.usersService.upload(
        this.patientId,
        this.userType,
        this.profileForm.value.profilePicture
      ).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.bufferValue = Math.round(event.loaded / event.total * 100);
          this.color = 'primary';
          this.mode = 'determinate';
        } else if (event.type === HttpEventType.Response) {
          this.isLoadingPic = false;
          this.avatar = event.body.imagePath;
          this.notificationService.success(':: ' + event.body.message);
        }
      });
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

    public downloadChart() {


    }

    gotoRecord() {
      this.router.navigate(['./record/chief-complaints'], {relativeTo: this.route});
    }

    onCancelVisit(patientId) {
      this.encountersService.update(1, patientId, this.licenseId).subscribe(() => {
        this.queService.findCancel(patientId).subscribe((res) => {
          this.notificationService.success(':: on que canceled.');
          this.isOnQue = false;
        });
      });
    }

    moveToQue(patientId) {
      this.encountersService.insert(patientId, this.licenseId).subscribe(() => {
        this.queService.insert(patientId, this.licenseId).subscribe((queRes) => {
          this.notificationService.success(':: on que done. #' + queRes.que.queNumber);
          this.isOnQue = true;
        });
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
