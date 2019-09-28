import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { FamilyHistoryData } from '../models/family-history-data';

const BACKEND_URL = environment.apiUrl + '/family-histories';

@Injectable({providedIn: 'root'})

export class FamilyHistoryService {
  private familyHistories: FamilyHistoryData[] = [];
  private familyHistoriesUpdated = new Subject<{ familyHistories: FamilyHistoryData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, familyHistories: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(familyHistoriesData => {
          return { familyHistories: familyHistoriesData.familyHistories.map(familyHistory => {
            return {
              id: familyHistory._id,
              created: familyHistory.created,
              patientId: familyHistory.patientId,
              familyHistories: familyHistory.familyHistory
            };
          }), max: familyHistoriesData.max};
        })
      )
      .subscribe((transformData) => {
        this.familyHistories = transformData.familyHistories;
        this.familyHistoriesUpdated.next({
          familyHistories: [...this.familyHistories],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.familyHistoriesUpdated.asObservable();
  }

  get(familyHistoryId: string) {
    return this.http.get<{ _id: string, familyHistory: string }>(
      BACKEND_URL + '/' + familyHistoryId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; familyHistory: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, familyHistory: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, familyHistory: string) {
    const recordData = {
      created, patientId, familyHistory
    };
    return this.http.post<{ message: string, record: FamilyHistoryData }>(BACKEND_URL, recordData);
  }

  update(familyHistoryId: string, created: string, patientId: string, familyHistory: string) {
    const recordData = {
      familyHistoryId, created, patientId, familyHistory
    };
    return this.http.put(BACKEND_URL + '/' + familyHistoryId, recordData);
  }

  delete(familyHistoryId: string) {
    return this.http.delete(BACKEND_URL + '/' + familyHistoryId);
  }


}
