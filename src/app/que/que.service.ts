import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { QueData } from './que-data.model';

const BACKEND_URL = environment.apiUrl + '/que';

@Injectable({providedIn: 'root'})

export class QueService {
  private ques: QueData[] = [];
  private quesUpdated = new Subject<{ ques: QueData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

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

  get(myUserId: string) {
    return this.http.get<{ onQue: boolean }>(
        BACKEND_URL + '/' + myUserId
      );
  }

  insert(myUserId: string) {
    const queData = {
      myUserId
    };
    return this.http.post<{ message: string, que: QueData }>(BACKEND_URL, queData);
  }

  delete(queId: string) {
    return this.http.delete(BACKEND_URL + '/' + queId);
  }

  findCancel(personId) {
    return this.http.delete(BACKEND_URL + '/cancel/' + personId);
  }

  findDelete(personId) {
    return this.http.delete(BACKEND_URL + '/smooth/' + personId);
  }

  clear() {
    return this.http.delete(BACKEND_URL + '/clear/');
  }

}
