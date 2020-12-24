import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  public form: FormGroup;
  public startDate = new Date(1990, 0, 1);
  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
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
      addresses: this.formBuilder.array([this.addAddressGroup()])
    });
  }

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

  onSubmit() {
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
        userId: userResponse.id
      };
      this.customerService.insert(customerData).subscribe((customerResponse) => {
        this.dialogRef.close({ data: customerResponse.customerId });
      });
    });
  }
}
