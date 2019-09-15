import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotesService } from '../../services/notes.service';
import { NoteData } from '../../models/note.model';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-progress-note-edit',
  templateUrl: './progress-note-edit.component.html',
  styleUrls: ['./progress-note-edit.component.css']
})
export class ProgressNoteEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  noteData: NoteData;
  private mode = 'create';

  complaintId: string;
  dialogTitle: string;
  dialogButton: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public notesService: NotesService,
    public route: ActivatedRoute,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ProgressNoteEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);

      this.recordId = data.id;
      this.complaintId = data.complaintIds;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.dialogButton = data.btnLabel;
    }

  ngOnInit() {
    super.doInit();

    this.form = new FormGroup({
      note: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(300) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.notesService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.noteData = {
              id: recordData._id,
              note: recordData.note,
              created: recordData.created,
              complaintId: recordData.complaintId,
              patientId: recordData.patientId
            };
            this.form.setValue({
              record_date: this.noteData.created,
              note: this.noteData.note
            });
          });
        } else {
          this.isLoading = false;
          this.mode = 'create';
          this.recordId = null;
        }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.notesService.insert(
        this.form.value.note,
        this.form.value.record_date,
        this.complaintId,
        this.patientId,
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.notesService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.notesService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
      });
    } else {
      this.notesService.update(
        this.recordId,
        this.form.value.note,
        this.form.value.record_date,
        this.complaintId,
        this.patientId,
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
