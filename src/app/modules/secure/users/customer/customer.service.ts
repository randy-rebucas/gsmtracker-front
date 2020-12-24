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
  private customerUpdated = new Subject<{ customers: Customer[] }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(userId: string) {
    const queryParams = `?labelOwner=${userId}`;
    this.http.get<{message: string, customers: any }>(BACKEND_URL + queryParams).pipe(
      map(customerData => {
        return {
          customers: customerData.customers.map(resCustomer => {
            return {
              id: resCustomer._id,
              customers: resCustomer.description
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.customerUpdated.next({
        customers: [...transformData.customers]
      });
    });
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

  delete(customerId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + customerId);
  }

  search(filter: {name: string} = {name: ''}): Observable<Customers> {
    return this.http.get<Customers>(BACKEND_URL + '/lookup')
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
