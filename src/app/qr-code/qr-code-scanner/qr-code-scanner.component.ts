import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

import { BarcodeFormat } from '@zxing/library';
// import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { PatientsService } from 'src/app/patients/patients.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent
extends SecureComponent
implements OnInit, OnDestroy {

  allowedFormats: any;
  scannerEnabled: boolean;
  qrResultString: string;
  dialogTitle: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public patientsService: PatientsService,
    public dialogRef: MatDialogRef < QrCodeScannerComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.dialogTitle = data.dialogTitle;
    }

  ngOnInit() {
    super.doInit();

    this.allowedFormats = [ BarcodeFormat.QR_CODE ];
    this.scannerEnabled = false;

  }

  onToggleScan() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  handleQrCodeResult(resultString: string) {
    if  (resultString != null) {
      this.patientsService.get(resultString).subscribe((response) => {
        if (response._id) {
          this.onClose();
          this.router.navigateByUrl('/patients/' + response._id + '/record/physical-exams/height');
        }
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
