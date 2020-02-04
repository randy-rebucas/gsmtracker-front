import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-patient-record-form',
  templateUrl: './patient-record-form.component.html',
  styleUrls: ['./patient-record-form.component.scss']
})
export class PatientRecordFormComponent implements OnInit {
  public form: FormGroup;
  public formTitle: string;
  public formButtontext: string;
  public patientId: string;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < PatientRecordFormComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.title;
    this.formButtontext = data.button;
    this.patientId = data.id;
  }

  ngOnInit() {
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });
  }

  addPrescriptionGroup() {
    return this.fb.group({
      medicine: ['', [Validators.required]],
      preparation: [''],
      sig: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
  }

  addPrescription() {
    this.prescriptionArray.push(this.addPrescriptionGroup());
  }

  removePrescription(index: number) {
    this.prescriptionArray.removeAt(index);
    this.prescriptionArray.markAsDirty();
    this.prescriptionArray.markAsTouched();
  }

  get prescriptionArray() {
    return this.form.get('prescriptions') as FormArray;
  }
  
  onSave() {
    if (this.form.invalid) {
      return;
    }
  }

  closeDialog() {
    this.form.reset();
    this.dialogRef.close();
  }
}
