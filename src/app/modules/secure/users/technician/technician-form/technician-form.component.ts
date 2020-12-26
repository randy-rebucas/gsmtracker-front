import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
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

  private subs = new SubSink();

  constructor(
    private userService: UserService,
    private technicianService: TechnicianService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<TechnicianFormComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.technicianId = data.id;
    this.dialogTitle = data.title;
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
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(11)
        ]
      }),
      addresses: this.formBuilder.array([this.addAddressGroup()])
    });
  }

  ngAfterViewInit(): void {
    if (this.technicianId) {
      this.subs.sink = this.technicianService.get(this.technicianId).subscribe((technicianResponse) => {
        console.log(technicianResponse);
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
