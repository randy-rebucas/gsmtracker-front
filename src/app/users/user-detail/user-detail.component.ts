import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { QueService } from 'src/app/que/que.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UsersService } from '../users.service';
import { HttpEventType } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/notification.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { EncountersService } from 'src/app/shared/encounters/encounters.service';
import { NetworksService } from 'src/app/networks/networks.service';
import { mimeType } from '../user-form/mime-type.validator';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: [`
  /* */
  .area {
    position: relative;
  }
  .header {
    margin-top: 1em;
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
export class UserDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {
  public isOnQue: boolean;
  public selectedFile: File = null;
  public imagePreview: string;
  public profileForm: FormGroup;

  userId: string;
  created: Date;
  email: string;
  userType: string;
  myUserId: string;
  avatar: string;
  metas: [];
  queNumber: number;

  isLoadingPic = false;
  bufferValue: number;
  color: string;
  mode: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
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

      this.usersService.get(this.myUserId).subscribe((results) => {
        this.isLoading = false;
        this.titleService.setTitle(results.firstname + ' ' + results.lastname);
        // person
        this.personId = results.personId;
        this.firstname = results.firstname;
        this.midlename = results.midlename;
        this.lastname = results.lastname;
        this.contact = results.contact;
        this.gender = results.gender;
        this.birthdate = results.birthdate;
        this.addresses = results.addresses;
        this.created = results.created;
        // users
        this.userId = results.userId;
        this.metas = results.metas;
        this.avatar = results.avatar;
        // auth
        this.email = results.email;
        // myuser document
        this.myUserId = results.myuserId;
        this.userType = results.userType;
      });
    }

    onFileChanged(event: Event) {
      this.selectedFile = (event.target as HTMLInputElement).files[0];
      this.profileForm.patchValue({ profilePicture: this.selectedFile });
      this.isLoadingPic = true;
      this.onSavePicture();
    }

    onSavePicture() {
      this.usersService.upload(
        this.userId,
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

    public downloadChart() {


    }

    gotoRecord() {
      this.router.navigate(['../record'], {relativeTo: this.activatedRoute});
    }

    onCancelVisit(myUserId) {
      this.encountersService.update(1, myUserId).subscribe(() => {

        this.queService.findCancel(myUserId).subscribe((que) => {
          if (que) {
            this.notificationService.success(':: on que canceled.');
            this.isOnQue = false;
          }
        });

      });
    }

    moveToQue(myUserId) {
      this.encountersService.insert(myUserId).subscribe(() => {

        this.queService.insert(myUserId).subscribe((que) => {
          if (que) {
            this.notificationService.success(':: on que done. #' + que.que.queNumber);
            this.isOnQue = true;
          }
        });

      });
    }

    addToNetwork(requesterId) {
      this.networksService.insert(requesterId, this.userId).subscribe(() => {
        this.notificationService.success(':: request sent');
      });
    }

    ngOnDestroy() {
      super.doDestroy();
    }
}
