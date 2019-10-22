import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { AssessmentData } from '../models/assessment-data.model';

const BACKEND_URL = environment.apiUrl + '/assessments';

@Injectable({providedIn: 'root'})

export class AssessmentService {
  private assessments: AssessmentData[] = [];
  private assessmentsUpdated = new Subject<{ assessments: AssessmentData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, assessments: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(assessmentData => {
          return { complaints: assessmentData.assessments.map(assessment => {
            return {
              id: assessment._id,
              created: assessment.created,
              patientId: assessment.patientId,
              diagnosis: assessment.diagnosis,
              treatments: assessment.treatments
            };
          }), max: assessmentData.max};
        })
      )
      .subscribe((transformData) => {
        this.assessments = transformData.complaints;
        this.assessmentsUpdated.next({
          assessments: [...this.assessments],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.assessmentsUpdated.asObservable();
  }

  get(assessmentId: string) {
    return this.http.get<{ _id: string; diagnosis: string, treatments: string }>(
      BACKEND_URL + '/' + assessmentId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; diagnosis: string, treatments: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, diagnosis: string, treatments: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, diagnosis: string, treatments: string) {
    const recordData = {
      created, patientId, diagnosis, treatments
    };
    return this.http.post<{ message: string, record: AssessmentData }>(BACKEND_URL, recordData);
  }

  update(assessmentId: string, created: string, patientId: string, diagnosis: string, treatments: string) {
    const recordData = {
      assessmentId, created, patientId, diagnosis, treatments
    };
    return this.http.put(BACKEND_URL + '/' + assessmentId, recordData);
  }

  delete(assessmentId: string) {
    return this.http.delete(BACKEND_URL + '/' + assessmentId);
  }


}