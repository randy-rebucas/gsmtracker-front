import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PrData } from '../models/pr.model';

const BACKEND_URL = environment.apiUrl + '/pulse-rate';

@Injectable({providedIn: 'root'})

export class PrService {
  private prs: PrData[] = [];
  private prsUpdated = new Subject<{ prs: PrData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, prs: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(prData => {
        return { prs: prData.prs.map(pr => {
          return {
            id: pr._id,
            pulserate: pr.pulserate,
            created: pr.created
          };
        }), max: prData.max};
      })
    )
    .subscribe((transformData) => {
      this.prs = transformData.prs;
      this.prsUpdated.next({
        prs: [...this.prs],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.prsUpdated.asObservable();
  }

  get(pulseRateId: string) {
    return this.http.get<{ _id: string; pulserate: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + pulseRateId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; pulserate: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; pulserate: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(pulserate: string, created: string, patientId: string) {
    const recordData = {
      pulserate, created, patientId
    };
    return this.http.post<{ message: string, record: PrData }>(BACKEND_URL, recordData);
  }

  update(pulseRateId: string, pulserate: string, created: string, patientId: string) {
    const recordData = {
      pulseRateId, pulserate, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + pulseRateId, recordData);
  }

  delete(pulseRateId: string) {
    return this.http.delete(BACKEND_URL + '/' + pulseRateId);
  }

}
