import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-qr-code-generate',
  templateUrl: './qr-code-generate.component.html',
  styleUrls: ['./qr-code-generate.component.css']
})
export class QrCodeGenerateComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public myAngularxQrCode: string = null;
  public dialogTitle: string;

  constructor(
    public authService: AuthService,
    public router: Router,

    public dialogRef: MatDialogRef < QrCodeGenerateComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router);

      this.dialogTitle = data.title;
      this.myAngularxQrCode = data.id; // 'Your QR code data string';
     }

  ngOnInit() {
    super.ngOnInit();
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
