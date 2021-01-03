import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RepairsService } from '../repairs.service';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { Repairs } from '../repairs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerFormComponent } from '../../users/customer/customer-form/customer-form.component';
import { CustomerService } from '../../users/customer/customer.service';
import { Customer } from '../../users/customer/customer';
import { CustomerLookupComponent } from '../../users/customer/customer-lookup/customer-lookup.component';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { TechnicianService } from '../../users/technician/technician.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Technician } from '../../users/technician/technician';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

export interface TechnicianLookup {
  id: string;
  name: string;
}

@Component({
  selector: 'app-repair-form',
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RepairFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public form: FormGroup;
  public formId: string;
  public isLoading: boolean;
  public preLoading: boolean;
  public initCheck: boolean;
  public filteredOptions: TechnicianLookup[] = [];
  public repair: Repairs;
  public customer: Customer;
  public technician: Technician;
  public selectedCustomerId: string;
  public hasCustomer: boolean;
  public selectedTechnicianId: string;
  public searchTechnician = new FormControl();
  public technicianOptionShow: boolean;
  public isNew: boolean;
  public userId: string;
  public cancel: string;
  public change: string;
  public innerTranslate: string;
  @ViewChild(MatAutocompleteTrigger) matAuto: MatAutocompleteTrigger;

  private subs = new SubSink();
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private repairsService: RepairsService,
    private technicianService: TechnicianService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {
    this.formId = this.activatedRoute.snapshot.params.formId;
    this.initCheck = true;
    this.isNew = false;
    this.technicianOptionShow = false;
    this.selectedCustomerId = 'empty';
    this.hasCustomer = false;
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.subs.sink = this.translate.get([
      'common.cancel',
      'common.change',
      'repairs.repair'
    ]).subscribe((translate: string) => {
        this.cancel = translate['common.cancel'];
        this.change = translate['common.change'];
        this.innerTranslate = translate['repairs.repair'];
      }
    );

    this.form = this.formBuilder.group({
      repairId: new FormControl(null),
      customerId: new FormControl(null, {
        validators: [
          Validators.required]
      }),
      technicianId: new FormControl(null, {
        validators: [
          Validators.required]
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
      amountPaid: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(6)
        ]
      })
    });
  }

  openCustomerLookup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    // set modal title
    this.subs.sink = this.translate.get('customers.customer-lookup').subscribe((translate) => {
      dialogConfig.data = {
        title: translate
      };
    });

    const dialogRef = this.dialog.open(CustomerLookupComponent, dialogConfig);
    this.subs.sink = dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.setCustomerId(result.data);
        this.getCustomerData(this.getCustomerId());
      }
    });
  }

  openCustomerForm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    // set modal title
    this.subs.sink = this.translate.get('customers.create-customers').subscribe((translate) => {
      dialogConfig.data = {
        title: translate
      };
    });

    const dialogRef = this.dialog.open(CustomerFormComponent, dialogConfig);
    this.subs.sink = dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.setCustomerId(result.data);
        this.getCustomerData(this.getCustomerId());
      }
    });
  }

  onRemoveCustomerId() {
    sessionStorage.removeItem('customerId');
    this.hasCustomer = false;
    this.selectedCustomerId = 'empty';
  }

  setCustomerId(customerId: string) {
    sessionStorage.setItem('customerId', customerId);
  }

  getCustomerId() {
    if (!sessionStorage.getItem('customerId')) {
      this.setCustomerId('empty');
    }
    return sessionStorage.getItem('customerId');
  }

  getCustomerData(customerId: string) {
    this.subs.sink = this.customerService.get(customerId).subscribe((customerResponse) => {
      this.hasCustomer = true;
      this.selectedCustomerId = customerResponse._id;
      this.formCtrls.customerId.setValue(customerResponse._id);
      this.customer = customerResponse.userId;
    });
  }

  toggleTechnicianOption() {
    this.technicianOptionShow = !this.technicianOptionShow;
  }

  getTechnicianData(technicianId: string) {
    this.subs.sink = this.technicianService.get(technicianId).subscribe((technicianResponse) => {
      this.selectedTechnicianId = technicianResponse._id;
      this.formCtrls.technicianId.setValue(technicianResponse._id);
      this.technician = technicianResponse.userId;
    });
  }

  ngAfterViewInit(): void {
    if (this.formId) {
      this.isNew = true;
      this.subs.sink = this.repairsService.get(this.formId).subscribe((repairResponse) => {
        if (repairResponse.customerId) {
          this.setCustomerId(repairResponse.customerId._id);
          this.getCustomerData(repairResponse.customerId._id);
        }
        if (repairResponse.technicianId) {
          this.selectedTechnicianId = repairResponse.technicianId;
          this.getTechnicianData(repairResponse.technicianId);
        }
        this.form.patchValue({
          repairId: repairResponse._id,
          customerId: (repairResponse.customerId) ? repairResponse.customerId._id : null,
          brand: repairResponse.phoneInfo.brand,
          serialNumber: repairResponse.phoneInfo.serialNumber,
          model: repairResponse.phoneInfo.model,
          other: repairResponse.phoneInfo.others,
          chiefCompliant: repairResponse.complaint,
          actionTaken: repairResponse.actionTaken,
          warranty: repairResponse.warranty,
          technician: (repairResponse.technicianId) ? repairResponse.technicianId : null,
          amountPaid: repairResponse.amountPaid
        });
      });
    }

    this.selectedCustomerId = this.getCustomerId();
    if (this.selectedCustomerId !== 'empty') {
      this.getCustomerData(this.getCustomerId());
    }

    this.subs.sink = this.searchTechnician.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.preLoading = true),
        startWith(''),
        switchMap((value) => {
          return this.technicianService.search({name: value}, this.userId)
          .pipe(
            finalize(() => this.preLoading = false),
          );
        })
      ).subscribe((users) => {
        this.filteredOptions = users.results;
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
      customerId: this.form.value.customerId,
      technicianId: this.form.value.technicianId,
      phoneInfo: {
        brand: this.form.value.brand,
        model: this.form.value.model,
        serialNumber: this.form.value.serialNumber,
        others: this.form.value.other,
      },
      complaint: this.form.value.chiefCompliant,
      actionTaken: this.form.value.actionTaken,
      warranty: this.form.value.warranty,
      amountPaid: this.form.value.amountPaid
    };

    const repairId = {
      _id: this.formId,
    };

    const updateRepair = {
      ...repairId, ...newRepair
    };

    if (!this.formId) {
      this.subs.sink = this.repairsService.insert(newRepair).subscribe(() => {
        this.subs.sink = this.translate.get('common.created-message', {s: this.innerTranslate }
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        this.form.reset();
        sessionStorage.removeItem('customerId');
        this.router.navigate(['/secure/repairs']);
      });
    } else {
      this.subs.sink = this.repairsService.update(updateRepair).subscribe(() => {
        this.subs.sink = this.translate.get('common.updated-message', {s: this.innerTranslate }
        ).subscribe((norifResMessgae: string) => {
          this.notificationService.success(norifResMessgae);
        });
        sessionStorage.removeItem('customerId');
        this.router.navigate(['/secure/repairs']);
      });
    }
  }

  displayFn(technician: TechnicianLookup) {
    return technician && technician.name ? technician.name : technician;
  }

  getTechnician(event: MatAutocompleteSelectedEvent) {
    this.formCtrls.technicianId.setValue(event.option.value.id);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.form.dirty) {
      let confirmMessage;
      this.subs.sink = this.translate.get('common.disregard-changes')
      .subscribe((translation) => {
        confirmMessage = translation;
      });
      return confirm(confirmMessage);
    }

    return true;
  }

  ngOnDestroy() {
    this.onRemoveCustomerId();
    this.subs.unsubscribe();
  }
}
