import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ImmunizationData } from '../models/immunization-data.model';

const BACKEND_URL = environment.apiUrl + '/immunizations';

@Injectable({providedIn: 'root'})

export class ImmunizationService {
  private immunizations: ImmunizationData[] = [];
  private immunizationsUpdated = new Subject<{ immunizations: ImmunizationData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, immunizations: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(immunizationData => {
        return { immunizations: immunizationData.immunizations.map(immunization => {
          return {
            id: immunization._id,
            vaccines: immunization.vaccines,
            doses: immunization.doses,
            created: immunization.created
          };
        }), max: immunizationData.max};
      })
    )
    .subscribe((transformData) => {
      this.immunizations = transformData.immunizations;
      this.immunizationsUpdated.next({
        immunizations: [...this.immunizations],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.immunizationsUpdated.asObservable();
  }

  get(immunizationId: string) {
    return this.http.get<{ _id: string, vaccines: string, doses: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + immunizationId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string, vaccines: string, doses: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, vaccines: string, doses: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(vaccines: string, doses: string, created: string, patientId: string) {
    const recordData = {
        vaccines, doses, created, patientId
    };
    return this.http.post<{ message: string, record: ImmunizationData }>(BACKEND_URL, recordData);
  }

  update(immunizationId: string, vaccines: string, doses: string, created: string, patientId: string) {
    const recordData = {
        immunizationId, vaccines, doses, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + immunizationId, recordData);
  }

  delete(immunizationId: string) {
    return this.http.delete(BACKEND_URL + '/' + immunizationId);
  }

}
