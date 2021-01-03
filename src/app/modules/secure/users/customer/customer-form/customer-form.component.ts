import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { Settings } from 'src/app/shared/interfaces/settings';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SubSink } from 'subsink';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public form: FormGroup;
  public customerId: string;
  public userId: string;
  public buttonLabel: string;
  public dialogTitle: string;
  public innerTranslate: string;
  public setting: Settings;
  public countries: any[] = [];
  public startDate = new Date(1990, 0, 1);
  private subs = new SubSink();

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private country: CountriesService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.customerId = data.id;
    this.dialogTitle = data.title;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.subs.sink = this.translate.get([
      (this.customerId) ? 'common.update' : 'common.submit',
      'customers.customer'
    ]
    ).subscribe((translate: string) => {
      console.log(translate);
      this.buttonLabel = translate[(this.customerId) ? 'common.update' : 'common.submit'];
      this.innerTranslate = translate['customers.customer'];
    });

    this.form = this.formBuilder.group({
      ownerId: new FormControl(null),
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
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(11)
        ]
      }),
      addresses: this.formBuilder.array([this.addAddressGroup()])
    });

    const newCountries = [];
    this.subs.sink = this.country.allCountries().subscribe((countries) => {
      for (const key in countries) {
        if (Object.prototype.hasOwnProperty.call(countries, key)) {
          const element = countries[key];
          newCountries.push({value: element.name, viewValue: element.name});
        }
      }
      this.countries = newCountries;
    });
  }

  ngAfterViewInit(): void {
    if (this.customerId) {
      this.subs.sink = this.customerService.get(this.customerId).subscribe((customerResponse) => {
        this.userId = customerResponse.userId._id;
        this.form.patchValue({
          ownerId: customerResponse.ownerId,
          firstname: customerResponse.userId.name.firstname,
          midlename: customerResponse.userId.name.midlename,
          lastname: customerResponse.userId.name.lastname,
          birthdate: customerResponse.userId.birthdate,
          contact: customerResponse.userId.contact,
          gender: customerResponse.userId.gender,
          bio: customerResponse.userId.description
        });
        const addressControl = this.form.controls.addresses as FormArray;
        const address = customerResponse.userId.addresses;
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});
      });
    } else {
      this.settingsService.getSetting(this.userId);
      this.subs.sink = this.settingsService.getSettingListener()
      .pipe(
        switchMap(setting => {
          this.setting = setting;
          return this.uploadService.get(setting._id);
        })
      )
      .subscribe((mergeRes) => {
        const settingResponse = { ...this.setting, ...mergeRes };

        const addressControl = this.form.controls.addresses as FormArray;
        console.log(addressControl.value);
        const address = [{
          address1: null,
          address2: null,
          city: null,
          country: settingResponse.country,
          current: false,
          postalCode: null,
          province: null
        }];
        for (let i = 1; i < address.length; i++) {
          addressControl.push(this.addAddressGroup());
        }
        this.form.patchValue({addresses: address});
      });
    }
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

    if (this.form.invalid) {
      return;
    }

    const newCustomer = {
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

    const updatedCustomer = {
      ...{ _id: this.customerId }, ...{ ownerId: this.form.value.ownerId }
    };

    const updatedUser = {
      ...{ _id: this.userId }, ...newCustomer
    };

    if (!this.customerId) {
      this.subs.sink = this.userService.insert(newCustomer).subscribe((userResponse) => {
        const customerData = {
          userId: userResponse.id,
          ownerId: this.authenticationService.getUserId()
        };
        this.subs.sink = this.customerService.insert(customerData).subscribe((customerResponse) => {
          this.translate.get('common.created-message', {s: this.innerTranslate}
          ).subscribe((norifResMessgae: string) => {
            this.notificationService.success(norifResMessgae);
          });
          this.dialogRef.close({ data: customerResponse.customerId });
        });
      });
    } else {
      this.subs.sink = this.userService.update(updatedUser).subscribe(() => {
        this.subs.sink = this.customerService.update(updatedCustomer).subscribe(() => {
          this.translate.get('common.updated-message', {s: this.innerTranslate }
          ).subscribe((norifResMessgae: string) => {
            this.notificationService.success(norifResMessgae);
          });
          this.dialogRef.close({ data: this.customerId });
        });
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
