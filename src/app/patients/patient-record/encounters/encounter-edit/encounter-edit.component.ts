import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintData } from '../../models/complaint-data.model';
import { NotesService } from '../../services/notes.service';
import { PrescriptionService } from '../../services/prescription.service';
import { AssessmentService } from '../../services/assessment.service';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';
import { UploadService } from 'src/app/upload/upload.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { Router } from '@angular/router';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.css']
})
export class EncounterEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  complaintData: ComplaintData;
  complaint: string;
  dialogTitle: string;
  btnLabel: string;

  complaintId: string;
  complaints: any;
  created: string;

  assessmentId: string;
  diagnosis: any;
  treatments: any;

  prescriptionId: string;
  prescriptions: any;

  noteId: string;
  note: string;

  attachments: any;

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    public uploadService: UploadService,
    public dialogRef: MatDialogRef < EncounterEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      //this.recordId = data.id;
      this.patientId = data.patientIds;
      this.dialogTitle = data.title;
      this.btnLabel = data.button;
      this.complaint = data.complaintId;
    }

  ngOnInit() {
    super.doInit();
    this.complaintService.get(this.complaint).subscribe(recordData => {
      this.complaintId = recordData._id;
      this.complaints = recordData.complaints;
      this.created = recordData.created;
    });
    /**
     * get assessment
     */
    this.getAssessement(this.complaint);

    this.recordsSub = this.assessmentService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getAssessement(this.complaint);
    });

    /**
     * get prescription
     */
    this.getPrescription(this.complaint);

    this.recordsSub = this.prescriptionService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getPrescription(this.complaint);
    });

    /**
     * get progress notes
     */
    this.getProgressNotes(this.complaint);

    this.recordsSub = this.notesService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getProgressNotes(this.complaint);
    });

    /**
     * get progress notes
     */
    this.getAttachments(this.complaint);

    this.recordsSub = this.uploadService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getAttachments(this.complaint);
    });
  }

  getAttachments(complaintId) {
    // this.uploadService.getByComplaintId(complaintId).subscribe(
    //   recordData => {
    //     if (Object.keys(recordData).length) {
    //       this.attachments = recordData;
    //     }
    //   }
    // );
  }

  getAssessement(complaintId) {
    // this.assessmentService.getByComplaintId(complaintId).subscribe(
    //   recordData => {
    //     console.log(recordData);
    //     if (Object.keys(recordData).length) {
    //       this.assessmentId = recordData[0]._id;
    //       this.diagnosis = recordData[0].diagnosis;
    //       this.treatments = recordData[0].treatments;
    //     }
    //   }
    // );
  }

  getPrescription(complaintId) {
    this.prescriptionService.getByComplaintId(complaintId).subscribe(
      recordData => {
        if (Object.keys(recordData).length) {
          this.prescriptionId = recordData[0]._id;
          this.prescriptions = recordData[0].prescriptions;
        }
      }
    );
  }

  getProgressNotes(complaintId) {
    // this.notesService.getByComplaintId(complaintId).subscribe(
    //   recordData => {
    //     if (Object.keys(recordData).length) {
    //       this.noteId = recordData[0]._id;
    //       this.note = recordData[0].note;
    //     }
    //   }
    // );
  }

  onPrintPreview(recordId, patientId) {
    this.onClose();

    const args = {
      width: '40%',
      id: recordId,
      dialogTitle: 'Preview Print',
      patient: patientId
    };
    super.onPopup(args, RxPadComponent);
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
