import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialog } from '@angular/material';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../patient-edit/mime-type.validator';
import { HttpEventType } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/notification.service';
import { QueService } from 'src/app/que/que.service';
import { EncountersService } from 'src/app/shared/encounters/encounters.service';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styles: [`
  /* */
  .area {
    position: relative;
  }
  .header {
    text-align: right;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    padding-bottom: 1em;
  }
  .area.side,
  .area.content {
    min-height: 700px;
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
  :host /deep/ .mat-list-item-content {
    position: relative;
  }

  a.more {
    min-width: 75px;
  }
  .mat-tab-link {
    min-width: 150px;
  }
  `]
})
export class PatientRecordComponent
extends SecureComponent
 implements OnInit, OnDestroy {

  created: Date;
  email: string;
  userType: string;
  avatar: string;
  metas: [];

  selectedFile: File = null;
  imagePreview: string;
  profileForm: FormGroup;
  isLoadingPic = false;
  bufferValue: number;
  color: string;
  mode: string;

  public isOnQue: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private usersService: UsersService,
    private route: ActivatedRoute,
    private titleService: Title,
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
        this.titleService.setTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Record');

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
      patientData: patientResponse
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
    const args = {
      width: '16%',
      id: patientId,
      dialogTitle: 'Generate QR Code',
      dialogButton: null
    };
    super.onPopup(args, QrCodeGenerateComponent);
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

  ngOnDestroy() {
    super.doDestroy();
  }
}
