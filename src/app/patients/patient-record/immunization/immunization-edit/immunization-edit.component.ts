import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';

import { ImmunizationService } from '../../services/immunization.service';
import { ImmunizationData } from '../../models/immunization-data.model';

import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';

export interface Vaccine {
  value: string;
  viewValue: string;
}

export interface Dose {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-immunization-edit',
  templateUrl: './immunization-edit.component.html',
  styleUrls: ['./immunization-edit.component.css']
})
export class ImmunizationEditComponent
extends SecureComponent
implements OnInit, OnDestroy {
  vaccines: Vaccine[] = [
    {value: 'Hepatitis B1 (HepB)', viewValue: 'Hepatitis B1 (HepB)'},
    {value: 'Rotavirus 2 (RV) (2-dose series) RV5 (3-dose series)', viewValue: 'Rotavirus 2 (RV) (2-dose series) RV5 (3-dose series)'},
    // tslint:disable-next-line: max-line-length
    {value: 'Diphtheria, tetanus, &amp; acellular pertussis 3 (CTap: <7 yrs)', viewValue: 'Diphtheria, tetanus, &amp; acellular pertussis 3 (CTap: <7 yrs)'},
    // tslint:disable-next-line: max-line-length
    {value: 'Tetanus, diphtheria, &amp; acellular pertussis 4(Tdap: >7 yrs)', viewValue: 'Tetanus, diphtheria, &amp; acellular pertussis 4(Tdap: >7 yrs)'},
    {value: 'Haemophilus influenzae type b5 (Hib)', viewValue: 'Haemophilus influenzae type b5 (Hib)'},
    {value: 'Pneumococcal conjugate6 (PCV13)', viewValue: 'Pneumococcal conjugate6 (PCV13)'},
    {value: 'Pneumococcal polysaccharide6 (PPSV23)', viewValue: 'Pneumococcal polysaccharide6 (PPSV23)'},
    {value: 'Inactivated poliovirus7 (IPV: <18 yrs)', viewValue: 'Inactivated poliovirus7 (IPV: <18 yrs)'},
    {value: 'Influenza8 (IIV; LAIV) 2 doses for some', viewValue: 'Influenza8 (IIV; LAIV) 2 doses for some'},
    {value: 'Measles, mumps, rubella9 (MMR)', viewValue: 'Measles, mumps, rubella9 (MMR)'},
    {value: 'Varicella10 (VAR)', viewValue: 'Varicella10 (VAR)'},
    {value: 'Hepatitis A11 (HepA)', viewValue: 'Hepatitis A11 (HepA)'},
    // tslint:disable-next-line: max-line-length
    {value: 'Human papillomavirus12 (HPV2: females only; HPV4: males and females)', viewValue: 'Human papillomavirus12 (HPV2: females only; HPV4: males and females)'},
    // tslint:disable-next-line: max-line-length
    {value: 'Meningococcal13 (Hib-MenCY> 6 weeks; MenACWY-D >9 mos;MenACWY-CRM ? 2 mos)', viewValue: 'Meningococcal13 (Hib-MenCY> 6 weeks; MenACWY-D >9 mos;MenACWY-CRM ? 2 mos)'}
  ];
  doses: Dose[] = [
    {value: '1st dose', viewValue: '1st dose'},
    {value: '2nd dose', viewValue: '2nd dose'},
    {value: '3rd dose', viewValue: '3rd dose'},
    {value: '4th dose', viewValue: '4th dose'},
    {value: '5th dose', viewValue: '5th dose'},
    {value: 'Tdap', viewValue: 'Tdap'},
    {value: 'see footnote 5', viewValue: 'see footnote 5'},
    {value: '2 dose-series', viewValue: '2 dose-series'},
    {value: '3 dose-series', viewValue: '3 dose-series'},
    {value: 'booster', viewValue: 'booster'},
    {value: 'Annual vaccination (IIV only) 1 or 2 dose', viewValue: 'Annual vaccination (IIV only) 1 or 2 dose'},
    {value: 'Annual vaccination (LAIV or IIV) 1 or 2 dose', viewValue: 'Annual vaccination (LAIV or IIV) 1 or 2 dose'},
    {value: 'Annual vaccination (IIV only) 1 dose only', viewValue: 'Annual vaccination (IIV only) 1 dose only'},
    {value: '3rd or 4th dose', viewValue: '3rd or 4th dose'}
  ];

  private mode = 'create';

  immunizationData: ImmunizationData;
  dialogTitle: string;
  btnLabel: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public immunizationService: ImmunizationService,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ImmunizationEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      super(authService, router, dialog, appconfig);
      this.recordId = data.id;
      this.patientId = data.patient;
      this.dialogTitle = data.title;
      this.btnLabel = data.button;
    }

  ngOnInit() {
    super.doInit();

    this.form = new FormGroup({
      vaccine: new FormControl(null, {
        validators: [Validators.required]
      }),
      dose: new FormControl(null, {
        validators: [Validators.required]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.immunizationService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.immunizationData = {
              id: recordData._id,
              vaccines: recordData.vaccines,
              doses: recordData.doses,
              created: recordData.created,
              patientId: recordData.patientId
            };
            this.form.setValue({
              vaccine: this.immunizationData.vaccines,
              dose: this.immunizationData.doses,
              record_date: this.immunizationData.created
            });
          });
        } else {
          this.isLoading = false;
          this.mode = 'create';
          this.recordId = null;
        }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.immunizationService.insert(
        this.form.value.vaccine,
        this.form.value.dose,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.immunizationService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.immunizationService.update(
        this.recordId,
        this.form.value.vaccine,
        this.form.value.dose,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.immunizationService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
