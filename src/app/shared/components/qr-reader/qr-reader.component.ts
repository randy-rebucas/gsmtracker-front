import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';

import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.scss']
})
export class QrReaderComponent implements OnInit {
  title: string;
  allowedFormats = [ BarcodeFormat.QR_CODE ];
  scannerEnabled: boolean;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: boolean;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  patient: any;
  setting: any;
  userId: string;
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private patientsService: PatientsService,
    public dialogRef: MatDialogRef < QrReaderComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.title;
    this.scannerEnabled = true;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.settingsService.getSetting(this.userId);
    this.settingsService.getSettingListener()
    .subscribe((setting) => {
      this.setting = setting;
    });
  }

  clearResult(): void {
    this.qrResultString = false;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.patientsService.get(resultString).subscribe((patient) => {
      this.qrResultString = true;
      this.patient = patient;
    });
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  onViewRecord(patient: any) {
    this.dialogRef.close();
    this.router.navigateByUrl('/secure/users/patients/' + patient._id + '/list');
  }
}
