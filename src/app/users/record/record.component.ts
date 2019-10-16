import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageEvent, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { AuthService } from 'src/app/auth/auth.service';

import { NotificationService } from 'src/app/shared/notification.service';
// import { PatientEditComponent } from '../patient-edit/patient-edit.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { QrCodeScannerComponent } from 'src/app/qr-code/qr-code-scanner/qr-code-scanner.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { UsersService } from 'src/app/users/users.service';
import { UserData } from 'src/app/users/user-data.model';
import { SelectionModel } from '@angular/cdk/collections';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { SettingsGeneralService } from 'src/app/settings/settings-general.service';
@Component({
  selector: 'app-records',
  styles: [``],
  templateUrl: './record.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecordComponent
extends SecureComponent
implements OnInit, OnDestroy {
  public userType: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,
    private activatedRoute: ActivatedRoute
  ) {
    super(authService, router, dialog, appconfig);
    this.activatedRoute.params.subscribe(
      (param) => {
        this.userType = param.userType;
      }
    );
  }

  ngOnInit() {
    super.doInit();
    console.log(this.userType);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
