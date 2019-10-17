import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { RprData } from '../models/rpr-data.model';

const BACKEND_URL = environment.apiUrl + '/respiratory-rate';

@Injectable({providedIn: 'root'})

export class RprService {
  private rprs: RprData[] = [];
  private rprsUpdated = new Subject<{ rprs: RprData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, rprs: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(rprData => {
        console.log(rprData);
        return { rprs: rprData.rprs.map(rpr => {
          return {
            id: rpr._id,
            respiratoryrate: rpr.respiratoryrate,
            created: rpr.created
          };
        }), max: rprData.max};
      })
    )
    .subscribe((transformData) => {
      this.rprs = transformData.rprs;
      this.rprsUpdated.next({
        rprs: [...this.rprs],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.rprsUpdated.asObservable();
  }

  get(respiratoryRateId: string) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + respiratoryRateId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(respiratoryrate: string, created: string, patientId: string) {
    const recordData = {
      respiratoryrate, created, patientId
    };
    return this.http.post<{ message: string, record: RprData }>(BACKEND_URL, recordData);
  }

  update(respiratoryRateId: string, respiratoryrate: string, created: string, patientId: string) {
    const recordData = {
      respiratoryRateId, respiratoryrate, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + respiratoryRateId, recordData);
  }

  delete(respiratoryRateId: string) {
    return this.http.delete(BACKEND_URL + '/' + respiratoryRateId);
  }

}
