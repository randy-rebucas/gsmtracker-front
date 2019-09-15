import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { ComplaintData } from '../../models/complaint-data.model';
import { ComplaintService } from '../../services/complaint.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { ChiefComplaintEditComponent } from '../chief-complaint-edit/chief-complaint-edit.component';
import { AssessmentService } from '../../services/assessment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { NotesService } from '../../services/notes.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-chief-complaint-list',
  templateUrl: './chief-complaint-list.component.html',
  styleUrls: ['./chief-complaint-list.component.css']
})
export class ChiefComplaintListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: ComplaintService[] = [];
  complaints: ComplaintData[] = [];

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['complaints', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.patientId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.complaintService
      .getUpdateListener()
      .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
        this.isLoading = false;
        this.total = complaintData.count;
        this.dataSource = new MatTableDataSource(complaintData.complaints);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate() {
    const args = {
      width: '30%',
      id: null,
      dialogTitle: 'New Record',
      dialogButton: 'Save',
      patient: this.patientId
    };
    super.onPopup(args, ChiefComplaintEditComponent);
  }

  onEdit(complaintId) {
    const args = {
      width: '30%',
      id: complaintId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, ChiefComplaintEditComponent);
  }

  onDelete(complaintId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.complaintService.delete(complaintId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
