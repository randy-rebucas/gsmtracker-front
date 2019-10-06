import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { EncountersData } from './encounters-data.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/encounter';

@Injectable({providedIn: 'root'})

export class EncountersService {
  private encounters: EncountersData[] = [];
  private encountersUpdated = new Subject<{ encounters: EncountersData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, encounters: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(encounterData => {
        return { encounters: encounterData.encounters.map(encounter => {
          return {
            id: encounter._id,
            status: encounter.status
          };
        }), max: encounterData.max};
      })
    )
    .subscribe((transformData) => {
      this.encounters = transformData.encounters;
      this.encountersUpdated.next({
        encounters: [...this.encounters],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.encountersUpdated.asObservable();
  }

  get(encounterId: string) {
    return this.http.get<{ _id: string; created: string, status: string }>(
      BACKEND_URL + '/' + encounterId
      );
  }

  insert(patientId: string, licenseId: string) {
    const recordData = {
      patientId, licenseId
    };
    return this.http.post<{ message: string, record: EncountersData }>(BACKEND_URL, recordData);
  }

  update(status: number, patientId: string, licenseId: string) {
    const recordData = {
      status
    };
    return this.http.put(BACKEND_URL + '/' + patientId + '/' + licenseId, recordData);
  }

  delete(encounterId: string) {
    return this.http.delete(BACKEND_URL + '/' + encounterId);
  }

}
