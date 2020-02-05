import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Medicine {
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
  filteredMovies: any;
  errorMsg: string;

  searchMoviesCtrl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<Medicine[]>;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < PatientRecordFormComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.title;
    this.formButtontext = data.button;
    this.patientId = data.id;

    this.showMore = false;
  }

  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    this.searchMoviesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredMovies = [];
          this.preLoading = true;
        }),
        switchMap(value => this.http.get('http://www.omdbapi.com/?t=' + value + '&apikey=74fdfa11&')
          .pipe(
            finalize(() => {
              this.preLoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        console.log(data);
        this.options.push(data);
        if (data === undefined) {
          this.filteredMovies = [];
        } else {
          this.filteredMovies = data;
        }
        console.log(this.options);
      });

    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });
  }

  // private _filter(value: string): Medicine[] {
  //   console.log(value);
  //   const filterValue = value.toLowerCase();

  //   // return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
  // }

  // displayFn(medicine: string) {
  //   this.selectedMedicine = medicine;
  //   console.log(this.selectedMedicine);
  //   // return country ? country.Country : country.CountryID;
  // }

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
