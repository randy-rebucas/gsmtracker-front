import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RepairsService } from '../repairs.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Repairs } from '../repairs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CustomerService } from '../../users/customer/customer.service';

@Component({
  selector: 'app-repair-form',
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RepairFormComponent implements OnInit, AfterViewInit {

  public form: FormGroup;
  public formId: string;

  public isLoading: boolean;
  public total: number;
  public perPage: number;
  public currentPage: number;
  public pageSizeOptions: any;

  public startDate = new Date(1990, 0, 1);
  public repair: Repairs;
  public selectedCustomerId: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private repairsService: RepairsService,
    private userService: UserService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.total = 0;
    this.perPage = 10;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 25, 100];
    this.selectedCustomerId = null;
    this.formId = this.activatedRoute.snapshot.params.formId;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      repairId: new FormControl(null),
      customerId: new FormControl(null),
      firstname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      midlename: new FormControl(null, {
        validators: [
          Validators.maxLength(30)
        ]
      }),
      lastname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      gender: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      birthdate: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      contact: new FormControl(null, {
        validators: [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(11)
        ]
      }),
      addresses: this.formBuilder.array([this.addAddressGroup()]),
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
      })
    });

  }

  ngAfterViewInit(): void {
    if (this.formId) {
      this.repairsService.get(this.formId).subscribe((repairResponse) => {
        this.form.patchValue({
          repairId: repairResponse._id,
          firstname: repairResponse.customerId.userId.name.firstname,
          midlename: repairResponse.customerId.userId.name.midlename,
          lastname: repairResponse.customerId.userId.name.lastname,
          gender: repairResponse.customerId.userId.gender,
          birthdate: repairResponse.customerId.userId.birthdate,
          contact: repairResponse.customerId.userId.contact,
          brand: repairResponse.phoneInfo.brand,
          serialNumber: repairResponse.phoneInfo.serialNumber,
          model: repairResponse.phoneInfo.model,
          other: repairResponse.phoneInfo.others,
          chiefCompliant: repairResponse.complaint,
          actionTaken: repairResponse.actionTaken,
          warranty: repairResponse.warranty,
          technician: repairResponse.technicians,
          amountPaid: repairResponse.amountPaid
        });
        const addressControl = this.form.controls.addresses as FormArray;
        const address = repairResponse.customerId.userId.addresses;
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});
      });
    }
  }

  // selectedCustomerId
  addAddressGroup() {
    return this.formBuilder.group({
      current: new FormControl(false),
      address1: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      }),
      address2: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(250)
        ]
      }),
      city: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }),
      province: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }),
      postalCode: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(6)
        ]
      }),
      country: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  addAddress() {
    this.addressArray.push(this.addAddressGroup());
  }

  removeAddress(index: number) {
    this.addressArray.removeAt(index);
    this.addressArray.markAsDirty();
    this.addressArray.markAsTouched();
  }

  get addressArray() {
    return this.form.get('addresses') as FormArray;
  }

  getAddresseFormGroup(index: any): FormGroup {
    return this.addressArray.controls[index] as FormGroup;
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
      technician: this.authenticationService.getUserId(),
      amountPaid: this.form.value.amountPaid
    };

    const repairId = {
      _id: this.formId,
    };

    const updateRepair = {
      ...repairId, ...newRepair
    };

    if (!this.formId) {
      const userData = {
        name: {
          firstname: this.form.value.firstname,
          midlename: this.form.value.midlename,
          lastname: this.form.value.lastname
        },
        gender: this.form.value.gender,
        birthdate: this.form.value.birthdate,
        contact: this.form.value.contact,
        current: this.form.value.current,
        addresses: this.form.value.addresses
      };

      this.userService.insert(userData).subscribe((userResponse) => {
        const customerData = {
          userId: userResponse.id,
          description: 'request job for unit: ' + newRepair.phoneInfo.brand + ' with serial num: ' + newRepair.phoneInfo.serialNumber
        };
        this.customerService.insert(customerData).subscribe((customerResponse) => {
          const patchRepair = { ...newRepair, customerId:  customerResponse.customerId };
          this.repairsService.insert(patchRepair).subscribe(() => {
            this.translate.get('common.created-message', {s: 'Repair'}
            ).subscribe((norifResMessgae: string) => {
              this.notificationService.success(norifResMessgae);
            });
            this.form.reset();
            this.router.navigate(['/secure/repairs']);
          });
        });
      });
    } else {
      this.repairsService.update(updateRepair).subscribe(() => {
        this.translate.get('common.updated-message', {s: 'Repair'}
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.router.navigate(['/secure/repairs']);
      });
    }
  }

}
