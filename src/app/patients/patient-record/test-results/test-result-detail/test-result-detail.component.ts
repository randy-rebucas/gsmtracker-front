import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TestResultEditComponent } from '../test-result-edit/test-result-edit.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-test-result-detail',
  templateUrl: './test-result-detail.component.html',
  styleUrls: ['./test-result-detail.component.css']
})
export class TestResultDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public recordsSub: Subscription;
  private fileId: string;

  id: string;
  created: string;
  path: string;
  name: string;
  type: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private activatedRoute: ActivatedRoute,
    public uploadService: UploadService,
    private dialogService: DialogService,
    private notificationService: NotificationService
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
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.fileId = paramMap.get('fileId');

      this.uploadService.getFile(this.fileId).subscribe(fileData => {
        this.isLoading = false;
        this.id = fileData._id;
        this.created = fileData.created;
        this.path = fileData.path;
        this.name = fileData.name;
        this.type = fileData.type;
      });

    });

  }

  onEdit(progressNoteId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: progressNoteId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(TestResultEditComponent, dialogConfig);
  }

  onDelete(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.uploadService.deleteFile(id).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);
          this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
