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
  private encountersUpdated = new Subject<{ encounters: EncountersData[] }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll() {
    this.http.get<{message: string, encounters: any }>(BACKEND_URL)
    .pipe(
      map(encounterData => {
        return { encounters: encounterData.encounters.map(
          encounter => {
            return {
              id: encounter._id,
              label: encounter._id.year,
              canceled: encounter.canceled,
              done: encounter.done,
              count: encounter.count
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.encounters = transformData.encounters;
      this.encountersUpdated.next({
        encounters: [...this.encounters]
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

  insert(myUserId: string) {
    const recordData = {
      myUserId
    };
    return this.http.post<{ message: string, record: EncountersData }>(BACKEND_URL, recordData);
  }

  update(status: number, myUserId: string) {
    const recordData = {
      status
    };
    return this.http.put(BACKEND_URL + '/' + myUserId, recordData);
  }

  delete(encounterId: string) {
    return this.http.delete(BACKEND_URL + '/' + encounterId);
  }

}
