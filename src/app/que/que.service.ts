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
  private quesUpdated = new Subject<{ ques: QueData[] }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(licenseId: string) {
      const queryParams = `?licenseId=${licenseId}`;
      this.http.get<{message: string, ques: any }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(queData => {
          return { ques: queData.ques.map(que => {
            return {
              id: que.id,
              queNumber: que.queNum,
              fullname: que.fullname
            };
          })};
        })
      )
      .subscribe((transformData) => {
        this.ques = transformData.ques;
        this.quesUpdated.next({
          ques: [...this.ques]
        });
      });
    }

  getUpdateListener() {
    return this.quesUpdated.asObservable();
  }

  insert(personId: string, licenseId: string) {
    const queData = {
      personId, licenseId
    };
    return this.http.post<{ message: string, que: QueData }>(BACKEND_URL, queData);
  }

  delete(queId: string) {
    return this.http.delete(BACKEND_URL + '/' + queId);
  }


}