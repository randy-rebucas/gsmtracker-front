import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { SubSink } from 'subsink';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

export interface CustomerLookup {
  id: string;
  name: string;
}

@Component({
  selector: 'app-customer-lookup',
  templateUrl: './customer-lookup.component.html',
  styleUrls: ['./customer-lookup.component.scss']
})
export class CustomerLookupComponent implements OnInit, OnDestroy {
  public preLoading: boolean;
  public userId: string;
  public dialogTitle: string;
  public filteredOptions: CustomerLookup[] = [];
  public searchCustomer = new FormControl();
  private subs = new SubSink();


  constructor(
    private customerService: CustomerService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<CustomerLookupComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.userId = this.authenticationService.getUserId();
    this.dialogTitle = data.title;
  }

  ngOnInit(): void {

    this.subs.sink = this.searchCustomer.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.preLoading = true),
      startWith(''),
      switchMap((value) => {
        return this.customerService.search({name: value}, this.userId)
        .pipe(
          finalize(() => this.preLoading = false),
        );
      })
    ).subscribe((users) => {
      this.filteredOptions = users.results;
    });

  }

  displayFn(customer: Customer) {
    return customer && customer.name ? customer.name : '';
  }

  getCustomer(event: MatAutocompleteSelectedEvent) {
    this.dialogRef.close({ data: event.option.value.id });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
