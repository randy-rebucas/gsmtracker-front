import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/encounter';

export interface Encounters {
  id: string;
  userId: string;
  created: Date;
  status: boolean;

  label: string;
  year: number;
  canceled: number;
  done: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private encounters: Encounters[] = [];
  private encountersUpdated = new Subject<{ encounters: Encounters[] }>();

  constructor(
    private http: HttpClient
  ) { }

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
    const newEncounter = {
      myUserId
    };
    return this.http.post<{ message: string, record: Encounters }>(BACKEND_URL, newEncounter);
  }

  update(status: number, myUserId: string) {
    const updatedEncounter = {
      status
    };
    return this.http.put(BACKEND_URL + '/' + myUserId, updatedEncounter);
  }

  delete(encounterId: string) {
    return this.http.delete(BACKEND_URL + '/' + encounterId);
  }
}
