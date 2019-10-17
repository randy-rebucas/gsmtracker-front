import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ComplaintData } from '../models/complaint-data.model';

const BACKEND_URL = environment.apiUrl + '/chief-complaints';

@Injectable({providedIn: 'root'})

export class ComplaintService {
  private complaints: ComplaintData[] = [];
  private complaintsUpdated = new Subject<{ complaints: ComplaintData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, complaints: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(complaintData => {
        return { complaints: complaintData.complaints.map(complaint => {
          return {
            id: complaint._id,
            complaints: complaint.complaints,
            created: complaint.created
          };
        }), max: complaintData.max};
      })
    )
    .subscribe((transformData) => {
      this.complaints = transformData.complaints;
      this.complaintsUpdated.next({
        complaints: [...this.complaints],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.complaintsUpdated.asObservable();
  }

  get(complaintId: string) {
    return this.http.get<{ _id: string; complaints: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + complaintId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; complaints: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, complaints: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, complaints: string) {
    const recordData = {
      created, patientId, complaints
    };
    return this.http.post<{ message: string, complaint: ComplaintData }>(BACKEND_URL, recordData);
  }

  update(complaintId: string, created: string, patientId: string, complaints: string) {
    const recordData = {
      complaintId, created, patientId, complaints
    };
    return this.http.put(BACKEND_URL + '/' + complaintId, recordData);
  }

  delete(complaintId: string) {
    return this.http.delete(BACKEND_URL + '/' + complaintId);
  }

}
