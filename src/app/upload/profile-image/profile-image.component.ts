import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { mimeType } from '../../patients/patient-edit/mime-type.validator';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-profile-image',
  styles: [`
    // input[type="file"] {
    //     visibility: hidden;
    // }

    .image-preview {
        height: 5rem;
        margin: 1rem 0;
    }

    .image-preview img {
        height: 100%;
    }
    .mat-dialog-title button {
        float: right;
        border: none;
    }
    .mat-dialog-title {
        border-bottom: 1px solid rgb(169, 169, 169);
        padding: 0 0 1em 0;
    }
    .snapshot {
        justify-content: center;
        justify-items: center;
        justify-self: center;
        display: flex;
    }`],
  templateUrl: './profile-image.component.html'
})
export class ProfileImageComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  dialogTitle: string;
  btnLabel: string;

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 500},
    height: {ideal: 500}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ProfileImageComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.recordId = data.id;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.btnLabel = data.button;
    }

  ngOnInit() {
    super.doInit();
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    // this.form = new FormGroup({
    //   height: new FormControl(null, {
    //     validators: [Validators.required, Validators.maxLength(5) ]
    //   }),
    //   record_date: new FormControl(new Date(), {
    //     validators: [Validators.required]
    //   })
    // });

    //   this.heightService.get(this.recordId).subscribe(recordData => {
    //     this.isLoading = false;
    //     this.heightData = {
    //       id: recordData._id,
    //       height: recordData.height,
    //       created: recordData.created,
    //       patientId: recordData.patientId
    //     };
    //     this.form.setValue({
    //       height: this.heightData.height,
    //       record_date: this.heightData.created
    //     });
    //   });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    // this.heightService.update(
    // this.recordId,
    // this.form.value.height,
    // this.form.value.record_date,
    // this.patientId
    // ).subscribe(() => {
    // this.onClose();
    // this.notificationService.success(':: Updated successfully');
    // this.heightService.getAll(this.perPage, this.currentPage, this.patientId);
    // });
  }

  onClose() {
    this.dialogRef.close();
  }

//   onImagePicked(event: Event) {
//     const file = (event.target as HTMLInputElement).files[0];
//     this.form.patchValue({ image: file });
//     this.form.get('image').updateValueAndValidity();
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result as string;
//     };
//     reader.readAsDataURL(file);
//   }
public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    // tslint:disable-next-line: no-console
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}

