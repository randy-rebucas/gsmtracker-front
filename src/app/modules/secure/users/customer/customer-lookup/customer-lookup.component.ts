import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
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
export class CustomerLookupComponent implements OnInit {
  preLoading: boolean;
  public filteredOptions: CustomerLookup[] = [];
  public searchCustomer = new FormControl();
  constructor(
    private customerService: CustomerService,
    private titlecasePipe: TitleCasePipe,
    public dialogRef: MatDialogRef<CustomerLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {

    this.searchCustomer.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.preLoading = true),
      startWith(''),
      switchMap((value) => {
        return this.customerService.search({name: value})
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
}
