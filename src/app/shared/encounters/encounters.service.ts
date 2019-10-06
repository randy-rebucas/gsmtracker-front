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
  private encountersUpdated = new Subject<{ encounters: EncountersData[], labels: [] }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(licenseId: string) {
    const queryParams = `?licenseId=${licenseId}`;
    this.http.get<{message: string, encounters: any, labels: [] }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(encounterData => {
        return { encounters: encounterData.encounters.map(encounter => {
          return {
            id: encounter._id,
            status: encounter.status
          };
        }), label: encounterData.labels};
      })
    )
    .subscribe((transformData) => {
      this.encounters = transformData.encounters;
      this.encountersUpdated.next({
        encounters: [...this.encounters],
        labels: transformData.label
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
