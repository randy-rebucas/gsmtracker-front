import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HistoryData } from '../models/history-data.model';

const BACKEND_URL = environment.apiUrl + '/histories';

@Injectable({providedIn: 'root'})

export class HistoryService {
  private histories: HistoryData[] = [];
  private historiesUpdated = new Subject<{ histories: HistoryData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, histories: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(historyData => {
        return { histories: historyData.histories.map(history => {
          return {
            id: history._id,
            type: history.type,
            description: history.description,
            created: history.created
          };
        }), max: historyData.max};
      })
    )
    .subscribe((transformData) => {
      this.histories = transformData.histories;
      this.historiesUpdated.next({
        histories: [...this.histories],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.historiesUpdated.asObservable();
  }

  get(historyId: string) {
    return this.http.get<{ _id: string, type: string, description: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + historyId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, type: string, description: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(type: string, description: string, created: string, patientId: string) {
    const recordData = {
      type, description, created, patientId
    };
    return this.http.post<{ message: string, record: HistoryData }>(BACKEND_URL, recordData);
  }

  update(historyId: string, type: string, description: string, created: string, patientId: string) {
    const recordData = {
      historyId, type, description, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + historyId, recordData);
  }

  delete(historyId: string) {
    return this.http.delete(BACKEND_URL + '/' + historyId);
  }

}
