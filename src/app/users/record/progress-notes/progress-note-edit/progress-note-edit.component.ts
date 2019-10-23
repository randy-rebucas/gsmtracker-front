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
  styles: [`
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card-title {
    margin-bottom: unset !important;
    font-size: 14px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  button.mat-menu-trigger {
    position: absolute;
    right: 0;
    top: 5px;
  }
  :host /deep/ .mat-list-item-content {
    color: #fff;
    font-size: 14px;
  }
  h3.mat-subheader {
    color: #fff !important;
    font-size: 16px !important;
    font-weight: 100 !important;
  }
  `]
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
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.activatedRoute.parent.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.myUserId;
      }
    );
    this.form = new FormGroup({
      progressNote: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.notesService.insert(
      this.form.value.progressNote,
      this.form.value.record_date,
      this.patientId,
    ).subscribe(() => {
      this.form.reset();
      this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
