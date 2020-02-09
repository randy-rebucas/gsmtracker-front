import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { DrugsService } from 'src/app/shared/services/drugs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PromptComponent } from 'src/app/shared/components/prompt/prompt.component';
import { PatientsService } from '../../patients.service';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';

export interface Drug {
  id: string;
  name: string;
}

@Component({
  selector: 'app-patient-record-form',
  templateUrl: './patient-record-form.component.html',
  styleUrls: ['./patient-record-form.component.scss']
})
export class PatientRecordFormComponent implements OnInit, CanComponentDeactivate {

  preLoading: boolean;
  public patientId: string;
  public searchDrugsCtrl = new FormControl();
  public filteredOptions: Drug[] = [];
  public form: FormGroup;
  selectedDrug: string;

  get prescriptionArray() {
    return this.form.get('prescriptions').get('prescriptions') as FormArray;
  }

  user: any;

  constructor(
    private drugService: DrugsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientsService: PatientsService,
    private blockchainService: BlockchainService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {
    this.preLoading = false;
  }

  ngOnInit() {

    this.patientId = this.activatedRoute.snapshot.parent.parent.params.patientId;
    this.patientsService.get(this.patientId).subscribe((user) => {
      this.user = user;
    });

    this.searchDrugsCtrl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.preLoading = true),
        startWith(''),
        switchMap((value) => {
          return this.drugService.search({name: value})
          .pipe(
            finalize(() => this.preLoading = false),
          );
        })
      ).subscribe((users) => {
        this.filteredOptions = users.results;
      });

    this.form = this.fb.group({
        vitalSign: this.fb.group({
          temperature: ['', Validators.required],
          bloodPressure: ['', Validators.required],
          pulseRate: ['', Validators.required],
          respiratoryRate: ['', Validators.required]
        }),
        physicalExam: this.fb.group({
          height: ['', Validators.required],
          weight: ['', Validators.required]
        }),
        chiefCompliant: this.fb.group({
          chiefCompliant: ['', Validators.required]
        }),
        prescriptions: this.fb.group({
          prescriptions: this.fb.array([this.addPrescriptionGroup(this.selectedDrug)])
        }),
        presentIllness: this.fb.group({
          presentIllness: ''
        }),
        pastMedical: this.fb.group({
          pastMedical: ''
        }),
        familyHistory: this.fb.group({
          familyHistory: ''
        }),
        socialHistory: this.fb.group({
          socialHistory: ''
        }),
        assessments: this.fb.group({
          assessments: ''
        }),
        progressNotes: this.fb.group({
          progressNotes: ''
        })
    });
  }

  displayFn(drug: Drug) {
    return drug && drug.name ? drug.name : '';
  }

  getDrugs(event: MatAutocompleteSelectedEvent) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      title: 'Please confirm?',
      message: 'This will add ' + event.option.value.name
    };
    // show prompt
    this.dialog.open(PromptComponent, dialogConfig).afterClosed().subscribe((dialogRes) => {
      // check if confirmed
      if (dialogRes) {
        // get drug information
        this.drugService.get(event.option.value.id).subscribe((drugRes) => {
          // set new drug object with updated qty
          const updatedDrug = {
            _id: drugRes._id,
            quantity: Number(drugRes.quantity - 1)
          };
          this.drugService.update(updatedDrug).subscribe((updatedDrugRes) => {
            // append new row
            this.addPrescription(event.option.value.name);
          });
        });
      }
    });

  }

  addPrescriptionGroup(selectedDrug: string): FormGroup {
    return this.fb.group({
      medicine: [selectedDrug, [Validators.required]],
      preparation: [''],
      sig: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
  }

  addPrescription(selectedDrug: string) {
    this.prescriptionArray.push(this.addPrescriptionGroup(selectedDrug));
  }

  removePrescription(index: number) {
    this.prescriptionArray.removeAt(index);
    this.prescriptionArray.markAsDirty();
    this.prescriptionArray.markAsTouched();
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    const newTransaction = {
      from: this.authenticationService.getPrivateKey(),
      to: this.user.userId.privateKey,
      name: this.user.userId.name.firstname + ' ' + this.user.userId.name.midlename + ' ' + this.user.userId.name.lastname,
      transactions: this.form.value
    };

    this.blockchainService.insert(newTransaction).subscribe(() => {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute });
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.form.dirty) {
      return confirm('Do you want to discard the changes?');
    }

    return true;
  }

}
