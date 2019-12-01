import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/queing';

export interface Queing {
  id: string;
  queNumber: string;
  myUserId: string;
  fullname: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueingService {
  private ques: Queing[] = [];
  private quesUpdated = new Subject<{ ques: Queing[], count: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    this.http.get<{message: string, ques: any, max: number }>(
      BACKEND_URL
    )
    .pipe(
      map(queData => {
        return { ques: queData.ques.map(que => {
          return {
            id: que.id,
            queNumber: que.queNum,
            fullname: que.fullname,
            myUserId: que.myUserId
          };
        }), max: queData.max};
      })
    )
    .subscribe((transformData) => {
      this.ques = transformData.ques;
      this.quesUpdated.next({
        ques: [...this.ques],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.quesUpdated.asObservable();
  }

  checkPatientOnQue(patientId: string) {
    return this.http.get<{ onQue: boolean }>(
        BACKEND_URL + '/' + patientId
      );
  }

  insert(patientId: string) {
    const queData = {
      patientId
    };
    return this.http.post<{ message: string, que: Queing }>(BACKEND_URL, queData);
  }

  delete(queId: string) {
    return this.http.delete(BACKEND_URL + '/' + queId);
  }

  cancel(patientId: string) {
    return this.http.delete(BACKEND_URL + '/cancel/' + patientId);
  }

  findDelete(patientId) {
    return this.http.delete(BACKEND_URL + '/smooth/' + patientId);
  }

  clear() {
    return this.http.delete(BACKEND_URL + '/clear/');
  }
}
