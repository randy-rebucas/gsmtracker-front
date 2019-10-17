import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PastMedicalData } from '../models/past-medical-data.model';

const BACKEND_URL = environment.apiUrl + '/past-medicals';

@Injectable({providedIn: 'root'})

export class PastMedicalService {
  private pastMedicals: PastMedicalData[] = [];
  private pastMedicalsUpdated = new Subject<{ pastMedicals: PastMedicalData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, pastMedicals: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(pastMedicalsData => {
          return { pastMedicals: pastMedicalsData.pastMedicals.map(pastMedical => {
            return {
              id: pastMedical._id,
              created: pastMedical.created,
              patientId: pastMedical.patientId,
              pastMedicals: pastMedical.pastMedical
            };
          }), max: pastMedicalsData.max};
        })
      )
      .subscribe((transformData) => {
        this.pastMedicals = transformData.pastMedicals;
        this.pastMedicalsUpdated.next({
          pastMedicals: [...this.pastMedicals],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.pastMedicalsUpdated.asObservable();
  }

  get(pastMedicalId: string) {
    return this.http.get<{ _id: string, pastMedical: string }>(
      BACKEND_URL + '/' + pastMedicalId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; pastMedical: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, pastMedical: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, pastMedical: string) {
    const recordData = {
      created, patientId, pastMedical
    };
    return this.http.post<{ message: string, record: PastMedicalData }>(BACKEND_URL, recordData);
  }

  update(pastMedicalId: string, created: string, patientId: string, pastMedical: string) {
    const recordData = {
      pastMedicalId, created, patientId, pastMedical
    };
    return this.http.put(BACKEND_URL + '/' + pastMedicalId, recordData);
  }

  delete(pastMedicalId: string) {
    return this.http.delete(BACKEND_URL + '/' + pastMedicalId);
  }


}
