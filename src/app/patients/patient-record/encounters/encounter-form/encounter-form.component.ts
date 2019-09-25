import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

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
  selector: 'app-encounter-form',
  templateUrl: './encounter-form.component.html'
})
export class EncounterFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  isLinear = false;

  chiefComplaintFormGroup: FormGroup;
  presentIllnessFormGroup: FormGroup;
  medicalHistoryFormGroup: FormGroup;
  familyHistoryFormGroup: FormGroup;
  socialHistoryFormGroup: FormGroup;
  physicalExamFormGroup: FormGroup;
  assessmentFormGroup: FormGroup;
  orderFormGroup: FormGroup;
  prescriptionFormGroup: FormGroup;
  progressNotesFormGroup: FormGroup;
  testResultsFormGroup: FormGroup;

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private formBuilder: FormBuilder
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
    this.chiefComplaintFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.presentIllnessFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.medicalHistoryFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.familyHistoryFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.socialHistoryFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.physicalExamFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.assessmentFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.orderFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.prescriptionFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.progressNotesFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.testResultsFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
