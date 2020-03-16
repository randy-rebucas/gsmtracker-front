import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Observable, pipe } from 'rxjs';

import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { PatientsService } from '../../patients.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PrescriptionComponent } from 'src/app/shared/components/prescription/prescription.component';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/services/upload.service';
import { RequestComponent } from 'src/app/shared/components/request/request.component';
import { AccessService } from 'src/app/shared/services/access.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss']
})
export class PatientRecordListComponent implements OnInit, AfterViewInit {
  public blockchains: Blockchain[];
  public blockchain: Blockchain;
  public patientId: string;
  public physicians: any[];

  isLoading: boolean;
  hasPermission: boolean;
  user: any;
  pubKey: string;

  constructor(
    private translate: TranslateService,
    private accessService: AccessService,
    private activatedRoute: ActivatedRoute,
    private patientsService: PatientsService,
    private blockchainService: BlockchainService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.isLoading = true;
    this.pubKey = this.authenticationService.getPublicKey();
  }

  ngOnInit() {
    // get patientid parameter
    this.patientId = this.activatedRoute.snapshot.parent.params.patientId;
    // get patient Info
    this.patientsService.get(this.patientId)
    .pipe(
      switchMap((user) => {
        this.user = user;
        return this.blockchainService.getByUser(user.userId.publicKey);
      })
    )
    .subscribe((blocks) => {
      const newBlocks = [];
      blocks.forEach(block => {
        this.accessService.hasAcceess(block._id, this.authenticationService.getUserId()).subscribe((res) => {
          const hasAccess = {
            hasAccess: res.canAccess,
            physicianId: res.physician
          };
          newBlocks.push({ ...block, ...hasAccess });
        });
      });

      this.blockchains = newBlocks;
      this.physicians = this.user.physicians;
      this.isLoading = false;
    });

  }

  ngAfterViewInit() {
    this.hasPermission = false;
  }

  onRequest(selectedBlock?: string) {

      // setup dialog
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '25%';
      this.translate.get('common.request').subscribe((translation) => {
        dialogConfig.data = {
          blocks: this.blockchains,
          block: selectedBlock,
          title: translation,
          id: this.patientId
        };
      });
      this.dialog.open(RequestComponent, dialogConfig)
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            // this.notificationService.success(':: Updated successfully');
            // this.getQuery(this.perPage, this.currentPage);
          }
        }
      );
  }

  onViewPrint(blockchain: Blockchain) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.translate.get('common.preview').subscribe((translation) => {
      dialogConfig.data = {
        block: blockchain,
        title: translation
      };
    });
    this.dialog.open(PrescriptionComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // this.notificationService.success(':: Updated successfully');
          // this.getQuery(this.perPage, this.currentPage);
        }
      }
    );
  }

  onCreate() {
    this.router.navigate(['../form'], {relativeTo: this.activatedRoute});
  }

  onViewRecord(blockchain: any) {
    this.router.navigate(['../', blockchain._id], {relativeTo: this.activatedRoute});
  }
}
