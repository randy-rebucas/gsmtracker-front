import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { EndorsementData } from '../models/endorsement-data.model';

const BACKEND_URL = environment.apiUrl + '/endorsements';

@Injectable({providedIn: 'root'})

export class EndorsementService {
  private endorsements: EndorsementData[] = [];
  private endorsementsUpdated = new Subject<{ endorsements: EndorsementData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, endorsements: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(endorsementsData => {
          return { endorsements: endorsementsData.endorsements.map(endorsement => {
            return {
              id: endorsement._id,
              created: endorsement.created,
              patientId: endorsement.patientId,
              endorsement: endorsement.endorsement,
              endorsementRef: endorsement.endorsementRef
            };
          }), max: endorsementsData.max};
        })
      )
      .subscribe((transformData) => {
        this.endorsements = transformData.endorsements;
        this.endorsementsUpdated.next({
          endorsements: [...this.endorsements],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.endorsementsUpdated.asObservable();
  }

  get(endorsementId: string) {
    return this.http.get<{ _id: string, endorsement: string }>(
      BACKEND_URL + '/' + endorsementId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; endorsement: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(endorsementId) {
    return this.http.get<{ _id: string, endorsement: string }>(
      BACKEND_URL + '/last/' + endorsementId
      );
  }

  insert(created: string, patientId: string, endorsement: string, endorsementRef: string) {
    const recordData = {
      created, patientId, endorsement, endorsementRef
    };
    return this.http.post<{ message: string, record: EndorsementData }>(BACKEND_URL, recordData);
  }

  update(endorsementId: string, created: string, patientId: string, endorsement: string, endorsementRef: string) {
    const recordData = {
      endorsementId, created, patientId, endorsement, endorsementRef
    };
    return this.http.put(BACKEND_URL + '/' + endorsementId, recordData);
  }

  delete(endorsementId: string) {
    return this.http.delete(BACKEND_URL + '/' + endorsementId);
  }


}
