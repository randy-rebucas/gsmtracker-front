import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PresentIllnessData } from '../models/present-illness-data';

const BACKEND_URL = environment.apiUrl + '/present-illneses';

@Injectable({providedIn: 'root'})

export class PresentIllnessService {
  private presentIllnesses: PresentIllnessData[] = [];
  private presentIllnessesUpdated = new Subject<{ presentIllnesses: PresentIllnessData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, presentIllnesses: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(presentIllnessData => {
          return { presentIllnesses: presentIllnessData.presentIllnesses.map(presentIllness => {
            return {
              id: presentIllness._id,
              created: presentIllness.created,
              patientId: presentIllness.patientId,
              presentIllnesses: presentIllness.presentIllness
            };
          }), max: presentIllnessData.max};
        })
      )
      .subscribe((transformData) => {
        this.presentIllnesses = transformData.presentIllnesses;
        this.presentIllnessesUpdated.next({
          presentIllnesses: [...this.presentIllnesses],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.presentIllnessesUpdated.asObservable();
  }

  get(presentIllnessId: string) {
    return this.http.get<{ _id: string, presentIllness: string }>(
      BACKEND_URL + '/' + presentIllnessId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; presentIllness: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, presentIllness: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, presentIllness: string) {
    const recordData = {
      created, patientId, presentIllness
    };
    return this.http.post<{ message: string, record: PresentIllnessData }>(BACKEND_URL, recordData);
  }

  update(presentIllnessId: string, created: string, patientId: string, presentIllness: string) {
    const recordData = {
      presentIllnessId, created, patientId, presentIllness
    };
    return this.http.put(BACKEND_URL + '/' + presentIllnessId, recordData);
  }

  delete(presentIllnessId: string) {
    return this.http.delete(BACKEND_URL + '/' + presentIllnessId);
  }


}
