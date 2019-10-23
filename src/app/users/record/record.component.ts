import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/notification.service';
import { QueService } from 'src/app/que/que.service';
import { EncountersService } from 'src/app/shared/encounters/encounters.service';
import { mimeType } from '../user-form/mime-type.validator';
@Component({
  selector: 'app-records',
  templateUrl: './record.component.html',
  styles: [`
  /* */
  .area {
    position: relative;
  }
  .header {
    text-align: right;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    padding-bottom: 1em;
    padding-top: 1em;
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
export class RecordComponent
extends SecureComponent
implements OnInit, OnDestroy {
  public userType: string;
  id: string;
  myUserId: string;
  created: Date;
  email: string;
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
    private activatedRoute: ActivatedRoute,

    private usersService: UsersService,
    private titleService: Title,
    private notificationService: NotificationService,
    private queService: QueService,
    private encountersService: EncountersService
  ) {
    super(authService, router, dialog, appconfig);
    this.activatedRoute.parent.parent.params.subscribe(
      (param) => {
        this.userType = param.userType;
      }
    );
  }

  ngOnInit() {
    super.doInit();

    this.activatedRoute.parent.params.subscribe(
      (param) => {
        this.myUserId = param.myUserId;
      }
    );

    this.queService.get(this.myUserId).subscribe((res) => {
      this.isOnQue = res.onQue;
    });

    this.profileForm = new FormGroup({
      profilePicture: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.getPatientData(this.myUserId)
      .then((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.userData.firstname + ' ' + results.userData.lastname);
        // person
        this.personId = results.userData.personId;
        this.firstname = results.userData.firstname;
        this.midlename = results.userData.midlename;
        this.lastname = results.userData.lastname;
        this.contact = results.userData.contact;
        this.gender = results.userData.gender;
        this.birthdate = results.userData.birthdate;
        this.addresses = results.userData.addresses;
        this.created = results.userData.created;
        // users
        this.id = results.userData.userId;
        this.metas = results.userData.metas;
        this.avatar = results.userData.avatar;
        // auth
        this.email = results.userData.email;
        // myuser document
        this.myUserId = results.userData.myuserId;
        this.userType = results.userData.userType;
      })
      .catch(err => console.log(err));
  }

  async getPatientData(myUserId) {
    const userResponse = await this.usersService.get(myUserId).toPromise();
    return {
      userData: userResponse
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
      this.id,
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

  generateQrCode(myUserId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '16%';
    dialogConfig.data = {
      id: myUserId,
      title: 'Generate QR Code'
    };
    this.dialog.open(QrCodeGenerateComponent, dialogConfig);
  }

  async onCancelVisit(myUserId) {
    const encounter = await this.encountersService.update(1, myUserId, this.licenseId).toPromise();
    const que = await this.queService.findCancel(myUserId).toPromise();
    if (que) {
      this.notificationService.success(':: on que canceled.');
      this.isOnQue = false;
    }
  }

  async moveToQue(myUserId) {
    const encounter = await this.encountersService.insert(myUserId, this.licenseId).toPromise();
    const que = await this.queService.insert(myUserId, this.licenseId).toPromise();
    if (que) {
      this.notificationService.success(':: on que done. #' + que.que.queNumber);
      this.isOnQue = true;
    }
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
