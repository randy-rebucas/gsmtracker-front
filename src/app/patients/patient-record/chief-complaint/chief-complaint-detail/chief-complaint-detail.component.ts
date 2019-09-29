import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AssessmentService } from '../../services/assessment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { NotesService } from '../../services/notes.service';
import { AssessmentEditComponent } from '../../assessments/assessment-edit/assetment-edit.component';
import { PrescriptionEditComponent } from '../../prescriptions/prescription-edit/prescription-edit.component';
import { ProgressNoteEditComponent } from '../../progress-notes/progress-note-edit/progress-note-edit.component';
import { ChiefComplaintEditComponent } from '../chief-complaint-edit/chief-complaint-edit.component';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';
import { UploadService } from 'src/app/upload/upload.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-chief-complaint-detail',
  templateUrl: './chief-complaint-detail.component.html',
  styleUrls: ['./chief-complaint-detail.component.css']
})
export class ChiefComplaintDetailComponent
extends SecureComponent
implements OnInit, OnDestroy {

  id: string;
  complaints: any;
  created: string;

  assessmentId: string;
  diagnosis: any;
  treatments: any;

  prescriptionId: string;
  prescriptions: any;

  noteId: string;
  note: string;

  patientId: string;
  targetElem: any;
  targetWidth: any;

  attachments: any;

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public activatedRoute: ActivatedRoute,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    public uploadService: UploadService,
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

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('complaintId');
    });

    /**
     * get complaint
     */
    // this.getComplaint(this.id);

    // this.recordsSub = this.complaintService
    // .getUpdateListener()
    // .subscribe(() => {
    //   this.isLoading = false;
    //   this.getComplaint(this.id);
    // });
    /**
     * get assessment
     */
    this.getAssessement(this.id);

    this.recordsSub = this.assessmentService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getAssessement(this.id);
    });

    /**
     * get prescription
     */
    this.getPrescription(this.id);

    this.recordsSub = this.prescriptionService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getPrescription(this.id);
    });

    /**
     * get progress notes
     */
    this.getProgressNotes(this.id);

    this.recordsSub = this.notesService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getProgressNotes(this.id);
    });

    /**
     * get progress notes
     */
    // this.getAttachments(this.id);

    // this.recordsSub = this.uploadService
    // .getUpdateListener()
    // .subscribe(() => {
    //   this.isLoading = false;
    //   this.getAttachments(this.id);
    // });
  }

  // getComplaint(complaintId) {
  //   this.complaintService.get(complaintId).subscribe(recordData => {
  //     this.id = recordData._id;
  //     this.complaints = recordData.complaints;
  //     this.created = recordData.created;
  //   });
  // }

  // getAttachments(complaintId) {
  //   this.uploadService.getByComplaintId(complaintId).subscribe(
  //     recordData => {
  //       if (Object.keys(recordData).length) {
  //         this.attachments = recordData;
  //       }
  //     }
  //   );
  // }

  getAssessement(complaintId) {
    // this.assessmentService.getByComplaintId(complaintId).subscribe(
    //   recordData => {
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

  onUpdate(elem, recordId) {
    switch (elem) {
      case 'assessment':
        this.targetElem = AssessmentEditComponent;
        this.targetWidth = '30%';
        break;
      case 'prescription':
        this.targetElem = PrescriptionEditComponent;
        this.targetWidth = '50%';
        break;
      case 'progress-notes':
        this.targetElem = ProgressNoteEditComponent;
        this.targetWidth = '30%';
        break;
      default:
        this.targetElem = ChiefComplaintEditComponent;
        this.targetWidth = '30%';
    }

    const args = {
      width: this.targetWidth,
      id: recordId,
      dialogTitle: 'Update Record',
      dialogButton: 'Update',
      patient: this.patientId
    };
    super.onPopup(args, this.targetElem);
  }

  onPrintPreview(recordId) {
    const args = {
      width: '40%',
      id: recordId,
      dialogTitle: 'Print preview',
      dialogButton: 'Print',
      patient: this.patientId
    };
    super.onPopup(args, RxPadComponent);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
