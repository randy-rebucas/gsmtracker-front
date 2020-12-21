import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RepairsService } from '../repairs.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-repair-form',
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss']
})
export class RepairFormComponent implements OnInit {

  public form: FormGroup;
  public formId: string;
  public formTitle: string;
  public formButtontext: string;

  public isLoading: boolean;
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  public startDate = new Date(1990, 0, 1);

  constructor(
    private repairsService: RepairsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef < RepairFormComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.formId = data.id;
    this.formTitle = data.title;
    this.formButtontext = data.button;

    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  ngOnInit() {

    this.form = this.fb.group({
      repairId: new FormControl(null),
      firstname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      lastname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      contact: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(11)
        ]
      }),
      brand: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      serialNumber: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      model: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      other: new FormControl(null, {
        validators: [
          Validators.maxLength(150)
        ]
      }),
      chiefCompliant: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(3000)
        ]
      }),
      actionTaken: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(3000)
        ]
      }),
      warranty: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      technician: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      amountPaid: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(6)
        ]
      }),
      address: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      })
    });

    if (this.formId) {
        this.isLoading = true;

        this.repairsService.get(this.formId).subscribe(repairData => {
          console.log(repairData);
          this.isLoading = false;
          this.form.patchValue({
            firstname: repairData.customer.name.firstname,
            lastname: repairData.customer.name.lastname,
            contact: repairData.customer.phone,
            address: repairData.customer.address,
            brand: repairData.phoneInfo.brand,
            serialNumber: repairData.phoneInfo.serialNumber,
            model: repairData.phoneInfo.model,
            other: repairData.phoneInfo.others,
            chiefCompliant: repairData.complaint,
            actionTaken: repairData.actionTaken,
            warranty: repairData.warranty,
            technician: repairData.technician,
            amountPaid: repairData.amountPaid,
          });
        });
      } else {
        this.isLoading = false;
        this.formId = null;
      }
  }

  get formCtrls() {
    return this.form.controls;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    const newRepair = {
      owners: [{
        ownerId: this.authenticationService.getUserId()
      }],
      customer: {
        name: {
          firstname: this.form.value.firstname,
          lastname: this.form.value.lastname
        },
        phone: this.form.value.contact,
        address: this.form.value.address
      },
      phoneInfo: {
        brand: this.form.value.brand,
        model: this.form.value.model,
        serialNumber: this.form.value.serialNumber,
        others: this.form.value.other,
      },
      complaint: this.form.value.chiefCompliant,
      actionTaken: this.form.value.actionTaken,
      warranty: this.form.value.warranty,
      technician: this.form.value.technician,
      amountPaid: this.form.value.amountPaid
    };

    const repairId = {
      _id: this.formId,
    };

    const updateRepair = {
      ...repairId, ...newRepair
    };

    console.log(updateRepair);
    if (!this.formId) {
      this.repairsService.insert(newRepair).subscribe((res) => {
        // set patient data
        this.onClose(res.repairId);
        // const newpatient = {
        //   userId: res.id,
        //   physician: this.authenticationService.getUserId()
        // };
        // this.patientsService.insert(newpatient).subscribe((response) => {
        //   this.onClose(response.patientId);
        // });
      });
    } else {
      this.repairsService.update(updateRepair).subscribe(() => {
        this.onClose('update');
      });
    }
  }

  onClose(state?: string) {
    this.form.reset();
    this.dialogRef.close(state);
  }

}
