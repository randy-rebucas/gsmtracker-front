import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { OrderData } from '../models/order-data.model';

const BACKEND_URL = environment.apiUrl + '/orders';

@Injectable({providedIn: 'root'})

export class OrderService {
  private orders: OrderData[] = [];
  private ordersUpdated = new Subject<{ orders: OrderData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, orders: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(orderData => {
        return { orders: orderData.orders.map(order => {
          return {
            id: order._id,
            order: order.order,
            created: order.created
          };
        }), max: orderData.max};
      })
    )
    .subscribe((transformData) => {
      this.orders = transformData.orders;
      this.ordersUpdated.next({
        orders: [...this.orders],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  get(orderId: string) {
    return this.http.get<{ _id: string; order: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + orderId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; order: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, order: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, order: string) {
    const recordData = {
      created, patientId, order
    };
    return this.http.post<{ message: string, order: OrderData }>(BACKEND_URL, recordData);
  }

  update(orderId: string, created: string, patientId: string, order: string) {
    const recordData = {
      orderId, created, patientId, order
    };
    return this.http.put(BACKEND_URL + '/' + orderId, recordData);
  }

  delete(orderId: string) {
    return this.http.delete(BACKEND_URL + '/' + orderId);
  }

}
