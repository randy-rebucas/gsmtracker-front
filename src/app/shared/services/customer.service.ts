import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/customers';

export interface Customer {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerSub = new Subject<{ customers: Customer[] }>();

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
      this.customerSub.next({
        customers: [...transformData.customers]
      });
    });
  }

  getLabels() {
    return this.customerSub.asObservable();
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

}
