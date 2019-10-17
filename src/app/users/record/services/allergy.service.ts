import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { AllergyData } from '../models/allergy-data.model';

const BACKEND_URL = environment.apiUrl + '/allergies';

@Injectable({providedIn: 'root'})

export class AllergyService {
  private allergies: AllergyData[] = [];
  private allergiesUpdated = new Subject<{ allergies: AllergyData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, allergies: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(allergyData => {
        console.log(allergyData);
        return { allergies: allergyData.allergies.map(allergy => {
          return {
            id: allergy._id,
            allergy: allergy.allergy
          };
        }), max: allergyData.max};
      })
    )
    .subscribe((transformData) => {
      this.allergies = transformData.allergies;
      this.allergiesUpdated.next({
        allergies: [...this.allergies],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.allergiesUpdated.asObservable();
  }

  get(allergyId: string) {
    return this.http.get<{ _id: string; allergy: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + allergyId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; allergy: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; height: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(allergy: string, patientId: string) {
    const recordData = {
      allergy, patientId
    };
    console.log(recordData);
    return this.http.post<{ message: string, record: AllergyData }>(BACKEND_URL, recordData);
  }

  update(allergyId: string, allergy: string, patientId: string) {
    const recordData = {
      allergyId, allergy, patientId
    };
    return this.http.put(BACKEND_URL + '/' + allergyId, recordData);
  }

  delete(allergyId: string) {
    return this.http.delete(BACKEND_URL + '/' + allergyId);
  }

}
