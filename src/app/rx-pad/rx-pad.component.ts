import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PrescriptionService } from '../patients/patient-record/services/prescription.service';
import { PrescriptionData } from '../patients/patient-record/models/prescription-data.model';
import { PatientsService } from '../patients/patients.service';
import { SecureComponent } from '../secure/secure.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rx-pad',
  templateUrl: './rx-pad.component.html',
  styleUrls: ['./rx-pad.component.css']
})
export class RxPadComponent
extends SecureComponent
implements OnInit, OnDestroy {

  title: string;
  canClosed: boolean;

  id: string;
  created: string;
  complaintId: string;
  prescriptions: any;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public titleService: Title,

    public prescriptionService: PrescriptionService,
    public patientsService: PatientsService,
    public dialogRef: MatDialogRef < RxPadComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(dialog, authService, router, titleService);
      this.recordId = data.id;
      this.patientId = data.patientId;
      this.title = data.title;
      this.canClosed = data.canClose ? true : false;
    }

  ngOnInit() {
    super.ngOnInit();

    this.getPatientData(this.patientId)
      .then((results) => {
        /**
         * disable loading state
         */
        this.isLoading = false;
        /**
         * set the page title
         */
        super.onSetTitle(results.patientData.firstname + ' ' + results.patientData.lastname + ' Record');
        /**
         * person data
         */
        this.id = results.patientData._id;
        this.firstname = results.patientData.firstname;
        this.midlename = results.patientData.midlename;
        this.lastname = results.patientData.lastname;
        this.contact = results.patientData.contact;
        this.gender = results.patientData.gender;
        this.birthdate = results.patientData.birthdate;
        this.address = results.patientData.address;
        /**
         * prescription data
         */
        this.prescriptions = results.prescriptionData.prescriptions;
      })
      .catch(err => console.log(err));
  }

  async getPatientData(patientId) {
    const patientResponse = await this.patientsService.get(patientId).toPromise();
    const prescriptionResponse = await this.prescriptionService.get(this.recordId).toPromise();
    return {
      patientData: patientResponse,
      prescriptionData: prescriptionResponse
    };
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
