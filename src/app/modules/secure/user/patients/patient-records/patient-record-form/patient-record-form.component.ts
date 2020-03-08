import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, tap, switchMap, finalize, flatMap } from 'rxjs/operators';
import { DrugsService } from 'src/app/shared/services/drugs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PromptComponent } from 'src/app/shared/components/prompt/prompt.component';
import { PatientsService } from '../../patients.service';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { numberValidator } from 'src/app/validators/number-validator';
import { ErrorStateMatcher } from '@angular/material/core';
import { PrescriptionComponent } from 'src/app/shared/components/prescription/prescription.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

export interface Drug {
  id: string;
  name: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-patient-record-form',
  templateUrl: './patient-record-form.component.html',
  styleUrls: ['./patient-record-form.component.scss']
})
export class PatientRecordFormComponent implements OnInit, CanComponentDeactivate {

  preLoading: boolean;
  isLoading: boolean;
  public patientId: string;
  public searchDrugsCtrl = new FormControl();
  public filteredOptions: Drug[] = [];
  public form: FormGroup;
  selectedDrug: string;
  isConfirmed: boolean;

  user: any;
  matcher = new MyErrorStateMatcher();

  constructor(
    private drugService: DrugsService,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private patientsService: PatientsService,
    private blockchainService: BlockchainService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {
    this.preLoading = false;
    this.isConfirmed = false;
    this.isLoading = false;
  }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.parent.params.patientId;
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
          temperature: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(6)
            ]
          }),
          bloodPressure: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(8)
            ]
          }),
          pulseRate: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(8)
            ]
          }),
          respiratoryRate: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(6)
            ]
          }),
        }),
        physicalExam: this.fb.group({
          height: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(6)
            ]
          }),
          weight: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(6)
            ]
          }),
        }),
        chiefCompliant: this.fb.group({
          chiefCompliant: new FormControl(null, {
            validators: [
              Validators.required,
              Validators.maxLength(3000)
            ]
          }),
        }),
        prescriptions: this.fb.group({
          prescriptions: this.fb.array([this.addPrescriptionGroup(this.selectedDrug)])
        }),
        presentIllness: this.fb.group({
          presentIllness: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
        }),
        pastMedical: this.fb.group({
          pastMedical: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
        }),
        familyHistory: this.fb.group({
          familyHistory: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
        }),
        socialHistory: this.fb.group({
          socialHistory: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
        }),
        assessments: this.fb.group({
          assessments: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
        }),
        progressNotes: this.fb.group({
          progressNotes: new FormControl(null, {
            validators: [
              Validators.maxLength(3000)
            ]
          }),
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
    this.translate.get('common.confirm-message')
    .subscribe((translation) => {
      dialogConfig.data = {
        title: translation,
        message: 'This will add ' +  event.option.value.name
      };
    });
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
      medicine: new FormControl(selectedDrug, {
        validators: [
          Validators.required
        ]
      }),
      preparation: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(150)
        ]
      }),
      sig: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(150)
        ]
      }),
      quantity: new FormControl(1, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3)
        ]
      })
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

  get prescriptionArray() {
    return this.form.get('prescriptions').get('prescriptions') as FormArray;
  }

  get formCtrls() {
    return this.form.controls;
  }

  getPrescriptionFormGroup(index: any): FormGroup {
    return this.prescriptionArray.controls[index] as FormGroup;
  }

  onSave() {

    if (this.form.invalid) {
      return;
    }

    this.isConfirmed = true;
    this.isLoading = true;

    const newTransaction = {
      from: this.authenticationService.getPublicKey(),
      to: this.user.userId.publicKey,
      transactions: this.form.value
    };

    this.blockchainService.insert(newTransaction).subscribe((blockchainRes) => {
      console.log(blockchainRes.blocks._doc);
      // check if physicians listed
      this.patientsService.checkPhysician(this.authenticationService.getUserId(), this.user._id).subscribe((res) => {
        // print prescription
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        // set modal attribute
        this.translate.get('common.preview')
        .subscribe((translation) => {
          dialogConfig.data = {
            block: blockchainRes.blocks._doc,
            title: translation
          };
        });

        this.dialog.open(PrescriptionComponent, dialogConfig)
          .afterClosed()
          .subscribe((result) => {
            this.isLoading = false;
            this.router.navigateByUrl('/secure/users/patients/' + this.patientId);
            this.notificationService.success(res.message);
          }
        );
      });
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.form.dirty && !this.isConfirmed) {
      return confirm('Do you want to discard the changes?');
    }

    return true;
  }

}
