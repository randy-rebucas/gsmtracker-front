import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Customer } from './customer';

const BACKEND_URL = environment.apiUrl + '/customers';

export class CustomerLookup {
  constructor(public id: string, public name: string) {}
}

export interface Customers {
  total: number;
  results: CustomerLookup[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerUpdated = new Subject<{ customers: Customer[], counts: number }>();
  private selectedSub = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(userId: string) {
    const queryParams = `?ownerId=${userId}`;
    this.http.get<{message: string, customers: any, counts: number }>(BACKEND_URL + queryParams)
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.customerSub(transformData);
    });
  }

  customerSub(transformData) {
    this.customerUpdated.next({
      customers: [...transformData.customers],
      counts: transformData.max
    });
  }

  getMap(customerData) {
    return { customers: customerData.customers.map(customer => {
      const customerFirstname = customer.userId.name.firstname;
      const customerLastname = customer.userId.name.lastname;

      let customerAddress = null;
      if (customer.userId.addresses.length > 0) {
        const address1 = customer.userId.addresses[0].address1;
        const address2 = customer.userId.addresses[0].address2;
        customerAddress = address2.concat(', ', address1.toString());
      }

      return {
        id: customer._id,
        gender: customer.userId.gender,
        name: customerLastname.concat(', ', customerFirstname.toString()),
        contact: customer.userId.contact,
        address: customerAddress,
        ownerId: customer.ownerId
      };
    }), max: customerData.counts};
  }

  getUpdateListener() {
    return this.customerUpdated.asObservable();
  }

  get(customerId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + customerId);
  }

  insert(newCustomer: any) {
    return this.http.post<{ message: string, customerId: any }>(BACKEND_URL, newCustomer);
  }

  update(updatedCustomer: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedCustomer._id, updatedCustomer);
  }

  deleteMany(customerIds: []) {
    const queryParams = `?customerIds=${customerIds}`;
    return this.http.delete<{ message: string }>(BACKEND_URL + queryParams);
  }

  setSelectedItem(selectedItem: any) {
    this.selectedSub.next(selectedItem);
  }

  getSelectedItem() {
    return this.selectedSub.asObservable();
  }

  search(filter: {name: string} = {name: ''}, ownerId: string): Observable<Customers> {
    return this.http.get<Customers>(BACKEND_URL + '/lookup/' + ownerId)
    .pipe(
      tap((response: Customers) => {
        response.results = response.results.map(
            customer => new CustomerLookup(customer.id, customer.name)
          ).filter(
            customer => customer.name.includes(filter.name)
          );
        return response;
      })
    );
  }
}
