import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { PrescriptionData } from '../../models/prescription-data.model';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionEditComponent } from '../prescription-edit/prescription-edit.component';
import { ComplaintService } from '../../services/complaint.service';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})

export class PrescriptionListComponent
extends SecureComponent
implements OnInit, OnDestroy {


  records: PrescriptionService[] = [];
  prs: PrescriptionData[] = [];

  complaintId: string;

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['prescriptions', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public prescriptionService: PrescriptionService,
    public complaintService: ComplaintService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PrescriptionService
    ) {
      super(authService, router, dialog);
      this.activatedRoute.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }



  ngOnInit() {
    super.doInit();

    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.prescriptionService
      .getUpdateListener()
      .subscribe((prescriptionData: {prescriptions: PrescriptionData[], count: number}) => {
        this.isLoading = false;
        this.total = prescriptionData.count;
        this.dataSource = new MatTableDataSource(prescriptionData.prescriptions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onPrintPreview(recordId) {
    const args = {
      width: '40%',
      id: recordId,
      dialogTitle: 'Preview Print',
      patient: this.patientId
    };
    super.onPopup(args, RxPadComponent);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate(complaintId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId,
      btnLabel: 'Save'
    };
    this.dialog.open(PrescriptionEditComponent, dialogConfig);
  }

  onEdit(prescriptionId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: prescriptionId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(PrescriptionEditComponent, dialogConfig);
  }

  onDelete(prescriptionId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.prescriptionService.delete(prescriptionId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
