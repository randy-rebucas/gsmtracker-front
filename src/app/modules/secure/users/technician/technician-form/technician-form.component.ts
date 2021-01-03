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
import { TechnicianService } from '../technician.service';

@Component({
  selector: 'app-technician-form',
  templateUrl: './technician-form.component.html',
  styleUrls: ['./technician-form.component.scss']
})
export class TechnicianFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public form: FormGroup;
  public technicianId: string;
  public userId: string;
  public buttonLabel: string;
  public dialogTitle: string;
  public innerTranslate: string;
  public startDate = new Date(1990, 0, 1);
  public countries: any[] = [];
  public setting: Settings;
  private subs = new SubSink();

  constructor(
    private userService: UserService,
    private technicianService: TechnicianService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private country: CountriesService,
    private settingsService: SettingsService,
    private uploadService: UploadService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<TechnicianFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.technicianId = data.id;
    this.dialogTitle = data.title;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit(): void {
    this.subs.sink = this.translate.get([
      (this.technicianId) ? 'common.update' : 'common.submit',
      'technicians.technician'
    ]
    ).subscribe((translate: string) => {
      this.buttonLabel = translate[(this.technicianId) ? 'common.update' : 'common.submit'];
      this.innerTranslate = translate['technicians.technician'];
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
    if (this.technicianId) {
      this.subs.sink = this.technicianService.get(this.technicianId).subscribe((technicianResponse) => {
        this.userId = technicianResponse.userId._id;
        this.form.patchValue({
          ownerId: technicianResponse.ownerId,
          firstname: technicianResponse.userId.name.firstname,
          midlename: technicianResponse.userId.name.midlename,
          lastname: technicianResponse.userId.name.lastname,
          birthdate: technicianResponse.userId.birthdate,
          contact: technicianResponse.userId.contact,
          gender: technicianResponse.userId.gender,
          bio: technicianResponse.userId.description
        });
        const addressControl = this.form.controls.addresses as FormArray;
        const address = technicianResponse.userId.addresses;
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

  get address1() {
    return this.getAddresseFormGroup('address1');
  }

  onSubmit() {
    // console.log(this.addressArray.controls[0].get('address1').hasError);
    // console.log(this.addressArray.controls[0].get('address1').errors);
    if (this.form.invalid) {
      return;
    }

    const newTechnician = {
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

    const updatedTechnician = {
      ...{ _id: this.technicianId }, ...{ ownerId: this.form.value.ownerId }
    };

    const updatedUser = {
      ...{ _id: this.userId }, ...newTechnician
    };

    if (!this.technicianId) {
      this.subs.sink = this.userService.insert(newTechnician).subscribe((userResponse) => {
        const technicianData = {
          userId: userResponse.id,
          ownerId: this.authenticationService.getUserId(),
          description: 'a person works in shop.',
          isVerified: true
        };
        this.subs.sink = this.technicianService.insert(technicianData).subscribe((technicianResponse) => {
          this.subs.sink = this.translate.get('common.created-message', {s: this.innerTranslate }
          ).subscribe((norifResMessgae: string) => {
            this.notificationService.success(norifResMessgae);
          });
          this.dialogRef.close({ data: technicianResponse.technicianId });
        });
      });
    } else {
      this.subs.sink = this.userService.update(updatedUser).subscribe(() => {
        this.subs.sink = this.technicianService.update(updatedTechnician).subscribe(() => {
          this.translate.get('common.updated-message', { s: this.innerTranslate } ).subscribe((norifResMessgae: string) => {
            this.notificationService.success(norifResMessgae);
          });
          this.dialogRef.close({ data: this.technicianId });
        });
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
