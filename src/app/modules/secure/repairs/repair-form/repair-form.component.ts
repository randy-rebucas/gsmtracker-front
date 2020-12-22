import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RepairsService } from '../repairs.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private repairsService: RepairsService,
    private userService: UserService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
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

  }

  get formCtrls() {
    return this.form.controls;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const newRepair = {
      owners: [{
        ownerId: this.authenticationService.getUserId()
      }],
      phoneInfo: {
        brand: this.form.value.brand,
        model: this.form.value.model,
        serialNumber: this.form.value.serialNumber,
        others: this.form.value.other,
      },
      complaint: this.form.value.chiefCompliant,
      actionTaken: this.form.value.actionTaken,
      warranty: this.form.value.warranty,
      technicians: [{
        technicianId: this.authenticationService.getUserId()
      }],
      amountPaid: this.form.value.amountPaid
    };

    // const repairId = {
    //   _id: this.formId,
    // };

    // const updateRepair = {
    //   ...repairId, ...newRepair
    // };

    // console.log(updateRepair);

    // if (!this.formId) {
    const userData = {
      name: {
        firstname: this.form.value.firstname,
        lastname: this.form.value.lastname
      },
      contact: this.form.value.contact,
      addresses: [{
        current: true,
        address1: this.form.value.address
      }]
    };
    this.userService.insert(userData).subscribe((userResponse) => {
      const customerData = {
        userId: userResponse.id,
        description: 'request job for unit: ' + newRepair.phoneInfo.brand + ' with serial num: ' + newRepair.phoneInfo.serialNumber
      };
      this.customerService.insert(customerData).subscribe((customerResponse) => {
        const patchRepair = { ...newRepair, customerId:  customerResponse.customerId };
        this.repairsService.insert(patchRepair).subscribe((repairResponse) => {
          this.snackBar.open('Repair Save! Id: ' + repairResponse.repairId, null, {
            duration: 500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.form.reset();
          this.router.navigate(['/secure/repairs']);
        });
      });
    });
    // } else {
    //   this.repairsService.update(updateRepair).subscribe(() => {
    //     this.onClose('update');
    //   });
    // }
  }

}
