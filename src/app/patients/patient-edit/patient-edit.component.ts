import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PatientsService } from '../patients.service';
import { PatientData } from '../patient-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit, OnDestroy {
  patientsPerPage = 10;
  currentPage = 1;

  patient: PatientData;
  form: FormGroup;
  isLoading = false;
  startDate = new Date(1990, 0, 1);

  private mode = 'create';
  private patientId: string;
  public title: string;
  public btnLabel: string;
  private userId: string;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private patientsService: PatientsService,
    private dialogRef: MatDialogRef < PatientEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.patientId = data.id;
    this.title = data.title;
    this.btnLabel = data.btnLabel;
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      firstname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
      }),
      midlename: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      bloodType: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(3) ]
      }),
      contact: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(7), Validators.maxLength(13)]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required]
      }),
      birthdate: new FormControl(null, {
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(250)]
      }),
      comments: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.maxLength(350)]
      })
    });

    if (this.patientId) {
        this.mode = 'edit';
        this.isLoading = true;
        this.patientsService.getPatient(this.patientId).subscribe(patientData => {
          this.isLoading = false;
          this.patient = {
            id: patientData._id,
            bloodType: patientData.bloodType,
            comments: patientData.comments,
            userId: patientData.userId,
            personId: patientData.personId,
            firstname: patientData.firstname,
            midlename: patientData.midlename,
            lastname: patientData.lastname,
            contact: patientData.contact,
            gender: patientData.gender,
            birthdate: patientData.birthdate,
            address: patientData.address,
          };
          this.form.setValue({
            bloodType: this.patient.bloodType,
            comments: this.patient.comments,
            firstname: this.patient.firstname,
            midlename: this.patient.midlename,
            lastname: this.patient.lastname,
            contact: this.patient.contact,
            gender: this.patient.gender,
            birthdate: this.patient.birthdate,
            address: this.patient.address,
          });
        });
      } else {
        this.mode = 'create';
        this.patientId = null;
      }
  }

  onSavePatient() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.patientsService.addPatient(
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.bloodType,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.address,
        this.form.value.comments
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
      });
    } else {
      this.patientsService.updatePatient(
        this.patientId,
        this.patient.personId,
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.bloodType,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.address,
        this.form.value.comments
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
