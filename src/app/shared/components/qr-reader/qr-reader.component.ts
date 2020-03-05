import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Patients } from 'src/app/modules/secure/user/patients/patients';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';
import { map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.scss']
})
export class QrReaderComponent implements OnInit {
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  qrResult: Patients;
  guestExist: boolean;

  title: string;
  allowedFormats = [ BarcodeFormat.QR_CODE ];

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  constructor(
    private patientsService: PatientsService,
    public dialogRef: MatDialogRef < QrReaderComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {}

  // Clears the QR code scanned
  clearResult(): void {
    this.qrResult = null;
  }

  // Scans the QR code
  onCodeResult(resultString: string): void {
    console.log(resultString);
    this.guestExist = null;
    // if (this.checkQRJSON(resultString)) {
    //   this.qrResult = JSON.parse(resultString);
    //   this.checkInGuest(this.qrResult);
    //   this.clearMessage();
    // } else {
    //   this.guestExist = false;
    //   this.clearMessage();
    // }
  }

  // Permission for the app to use the device camera
  onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  // Checks if the QR code belongs to a valid guest
  checkInGuest(resultQR: Patients): void {
    console.log(resultQR);
    // this.patientsService.getUpdateListener()
    //   .pipe(
    //     map(guests =>
    //       guests.find((guest: Guest) => guest.id === guestQR.id)
    //     )
    //   )
    //   .subscribe(guest => {
    //     if (guest !== null && guest !== undefined) {
    //       this.guestExist = true;
    //     } else {
    //       this.guestExist = false;
    //     }
    //     this.clearResult();
    //     this.clearMessage();
    //   });
  }

  clearMessage() {
    setTimeout(() => {
      this.guestExist = null;
    }, 3000);
  }

  // This function check if the QR code has a valid JSON as data
  checkQRJSON(qrString: string): boolean {
    if (
      /^[\],:{}\s]*$/.test(
        qrString
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            ']'
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

}
