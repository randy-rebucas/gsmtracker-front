import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { NoteData } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { ProgressNoteEditComponent } from '../progress-note-edit/progress-note-edit.component';
import { ComplaintService } from '../../services/complaint.service';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-progress-note-list',
  templateUrl: './progress-note-list.component.html',
  styleUrls: ['./progress-note-list.component.css']
})
export class ProgressNoteListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  records: NotesService[] = [];

  complaintId: string;

  public recordsSub: Subscription;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['note', 'created', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public complaintService: ComplaintService,
    public notesService: NotesService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: NotesService,
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

    this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.notesService
      .getUpdateListener()
      .subscribe((noteData: {notes: NoteData[], count: number}) => {
        this.isLoading = false;
        this.total = noteData.count;
        this.dataSource = new MatTableDataSource(noteData.notes);
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
    this.dialog.open(ProgressNoteEditComponent, dialogConfig);
  }

  onEdit(progressNoteId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: progressNoteId,
        title: 'Update record',
        patient: this.patientId,
        btnLabel: 'Update'
    };
    this.dialog.open(ProgressNoteEditComponent, dialogConfig);
  }

  onDelete(progressNoteId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.notesService.delete(progressNoteId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
