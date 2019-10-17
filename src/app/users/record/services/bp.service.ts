import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { BpData } from '../models/bp-data.model';

const BACKEND_URL = environment.apiUrl + '/bps';

@Injectable({providedIn: 'root'})

export class BpService {
  private bps: BpData[] = [];
  private bpsUpdated = new Subject<{ bps: BpData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, bps: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(bpData => {
        console.log(bpData);
        return { bps: bpData.bps.map(bp => {
          return {
            id: bp._id,
            systolic: bp.systolic,
            diastolic: bp.diastolic,
            created: bp.created
          };
        }), max: bpData.max};
      })
    )
    .subscribe((transformData) => {
      this.bps = transformData.bps;
      this.bpsUpdated.next({
        bps: [...this.bps],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.bpsUpdated.asObservable();
  }

  get(bloodPressureId: string) {
    return this.http.get<{ _id: string; systolic: string, diastolic: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + bloodPressureId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; systolic: string, diastolic: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; systolic: string, diastolic: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(systolic: string, diastolic: string, created: string, patientId: string) {
    const recordData = {
        systolic, diastolic, created, patientId
    };
    return this.http.post<{ message: string, record: BpData }>(BACKEND_URL, recordData);
  }

  update(bloodPressureId: string, systolic: string, diastolic: string, created: string, patientId: string) {
    const recordData = {
      bloodPressureId, systolic, diastolic, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + bloodPressureId, recordData);
  }

  delete(bloodPressureId: string) {
    return this.http.delete(BACKEND_URL + '/' + bloodPressureId);
  }

}
