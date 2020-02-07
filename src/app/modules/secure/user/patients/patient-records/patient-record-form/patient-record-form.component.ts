import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { DrugsService } from 'src/app/shared/services/drugs.service';
import { Location } from '@angular/common';

export interface Drugs {
  id: string;
  name: string;
}

@Component({
  selector: 'app-patient-record-form',
  templateUrl: './patient-record-form.component.html',
  styleUrls: ['./patient-record-form.component.scss']
})
export class PatientRecordFormComponent implements OnInit, CanComponentDeactivate {
  public form: FormGroup;
  public formTitle: string;
  public formButtontext: string;
  public patientId: string;
  public showMore: boolean;
  preLoading = false;
  selectedMedicine: string;
  // filteredDrugs: any;
  public filteredDrugs: Drugs[] = [];
  errorMsg: string;

  searchDrugsCtrl = new FormControl();

  vitalSignFormGroup: FormGroup;
  physicalExamFormGroup: FormGroup;
  complaintFormGroup: FormGroup;
  prescriptionsFormGroup: FormGroup;
  presentIllnessFormGroup: FormGroup;
  pastMedicalFormGroup: FormGroup;
  familyHistoryFormGroup: FormGroup;
  socialHistoryFormGroup: FormGroup;
  assessmentsFormGroup: FormGroup;
  progressNotesFormGroup: FormGroup;
  isOptional = true;
  // options: any[] = [];
  // filteredOptions: Observable<Medicine[]>;

  constructor(
    private drugService: DrugsService,
    private fb: FormBuilder,
    private location: Location,
    private authenticationService: AuthenticationService,
  ) {
    // this.formTitle = data.title;
    // this.formButtontext = data.button;
    // this.patientId = data.id;

    this.showMore = false;
  }

  ngOnInit() {
    this.searchDrugsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.preLoading = true;
        }),
        switchMap(value => this.drugService.search({name: value})
          .pipe(
            finalize(() => {
              this.preLoading = false;
            }),
          )
        )
      )
      .subscribe(drug => {
        console.log(drug);
        this.filteredDrugs = drug.results;
      });

    // this.form = this.fb.group({
    //   firstname: ['', [Validators.required]],
    //   prescriptions: this.fb.array([this.addPrescriptionGroup()])
    // });

    this.vitalSignFormGroup = this.fb.group({
      temperature: ['', Validators.required],
      bloodPressure: ['', Validators.required],
      pulseRate: ['', Validators.required],
      respiratoryRate: ['', Validators.required]
    });

    this.physicalExamFormGroup = this.fb.group({
      height: ['', Validators.required],
      weight: ['', Validators.required]
    });

    this.complaintFormGroup = this.fb.group({
      chiefCompliant: ['', Validators.required]
    });

    this.prescriptionsFormGroup = this.fb.group({
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });

    this.presentIllnessFormGroup = this.fb.group({
      presentIllness: ''
    });

    this.pastMedicalFormGroup = this.fb.group({
      pastMedical: ''
    });

    this.familyHistoryFormGroup = this.fb.group({
      familyHistory: ''
    });

    this.socialHistoryFormGroup = this.fb.group({
      socialHistory: ''
    });

    this.assessmentsFormGroup = this.fb.group({
      assessments: ''
    });

    this.progressNotesFormGroup = this.fb.group({
      progressNotes: ''
    });
    
  }

  // private _filter(value: string): Medicine[] {
  //   console.log(value);
  //   const filterValue = value.toLowerCase();

  //   // return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
  // }
  
  displayFn(drug: Drugs) {
    if (drug) {
      return drug.name;
    }
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
    return this.prescriptionsFormGroup.get('prescriptions') as FormArray;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
  }

  onCancel() {
    this.location.back();
  }

  onClose() {
    this.form.reset();
    // this.dialogRef.close();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.form.dirty) {
      return confirm('Do you want to discard the changes?');
    }

    return true;
  }

  onToggleMore() {
    this.showMore = !this.showMore;
  }
}
