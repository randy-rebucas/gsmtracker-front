import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

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
  templateUrl: './image.component.html'
})
export class ImageComponent
extends SecureComponent
implements OnInit, OnDestroy {
  @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  isSelected = false;

  dialogTitle: string;
  btnLabel: string;

  // // toggle webcam on/off
  // public showWebcam = true;
  // public allowCameraSwitch = true;
  // public multipleWebcamsAvailable = false;
  // public deviceId: string;
  // public videoOptions: MediaTrackConstraints = {
  //   width: {ideal: 500},
  //   height: {ideal: 500}
  // };
  // public errors: WebcamInitError[] = [];

  // // latest snapshot
  // public webcamImage: WebcamImage = null;

  // // webcam snapshot trigger
  // private trigger: Subject<void> = new Subject<void>();
  // // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  // private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ImageComponent >,
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
    // WebcamUtil.getAvailableVideoInputs()
    //   .then((mediaDevices: MediaDeviceInfo[]) => {
    //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    // });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isSelected = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  onUpload() {
    console.log(this.croppedImage);
      //   this.usersService.upload(
  //     this.uId,
  //     this.userType,
  //     this.profileForm.value.profilePicture
  //   ).subscribe((event) => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       console.log('upload progress: ' + Math.round(event.loaded / event.total * 100) + '%');
  //     } else if (event.type === HttpEventType.Response) {
  //       console.log(event); // handle event here
  //     }
  //     this.notificationService.success(':: profile picture updated successfully');
  //   });
  }

  onClose() {
    this.dialogRef.close();
  }

  // public triggerSnapshot(): void {
  //   this.trigger.next();
  //   this.showWebcam = false;
  // }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }

  // public handleInitError(error: WebcamInitError): void {
  //   this.errors.push(error);
  // }

  // public showNextWebcam(directionOrDeviceId: boolean|string): void {
  //   // true => move forward through devices
  //   // false => move backwards through devices
  //   // string => move to device with given deviceId
  //   this.nextWebcam.next(directionOrDeviceId);
  // }

  // public handleImage(webcamImage: WebcamImage): void {
  //   // tslint:disable-next-line: no-console
  //   console.info('received webcam image', webcamImage);
  //   this.webcamImage = webcamImage;
  //   this.imageChangedEvent = webcamImage;
  // }

  // public cameraWasSwitched(deviceId: string): void {
  //   console.log('active device: ' + deviceId);
  //   this.deviceId = deviceId;
  // }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  // public get nextWebcamObservable(): Observable<boolean|string> {
  //   return this.nextWebcam.asObservable();
  // }

  ngOnDestroy() {
    super.doDestroy();
  }
}

