import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { AssessmentData } from '../../models/assessment-data.model';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentEditComponent } from '../assessment-edit/assetment-edit.component';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: AssessmentService[] = [];
  assessments: AssessmentData[] = [];

  complaintId: string;

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['diagnosis', 'treatments', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AssessmentService,
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

    this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.assessmentService
      .getUpdateListener()
      .subscribe((assessmentData: {assessments: AssessmentData[], count: number}) => {
        this.isLoading = false;
        this.total = assessmentData.count;
        this.dataSource = new MatTableDataSource(assessmentData.assessments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onCreate(complaintId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId,
      btnLabel: 'Save'
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  onEdit(assessmentId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: assessmentId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  onDelete(assessmentId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.assessmentService.delete(assessmentId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
