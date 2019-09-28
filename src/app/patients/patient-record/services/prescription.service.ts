import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PrescriptionData } from '../models/prescription-data.model';

const BACKEND_URL = environment.apiUrl + '/prescriptions';

@Injectable({providedIn: 'root'})

export class PrescriptionService {
  private prescriptions: PrescriptionData[] = [];
  private prescriptionsUpdated = new Subject<{ prescriptions: PrescriptionData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, prescriptions: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(prescriptionData => {
        return { prescriptions: prescriptionData.prescriptions.map(prescription => {
          return {
            id: prescription._id,
            created: prescription.created,
            patientId: prescription.patientId,
            prescriptions: prescription.prescriptions,
          };
        }), max: prescriptionData.max};
      })
    )
    .subscribe((transformData) => {
      this.prescriptions = transformData.prescriptions;
      this.prescriptionsUpdated.next({
        prescriptions: [...this.prescriptions],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.prescriptionsUpdated.asObservable();
  }

  get(prescriptionId: string) {
    return this.http.get<{ _id: string, created: string, patientId: string, prescriptions: [] }>(
      BACKEND_URL + '/' + prescriptionId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string, created: string, patientId: string, prescriptions: [] }>(
      BACKEND_URL + '/latest'
      );
  }

  getByComplaintId(complaintId) {
    return this.http.get<{ _id: string, created: string, patientId: string, prescriptions: [] }>(
      BACKEND_URL + '/complaint/' + complaintId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, created: string, patientId: string, prescriptions: [] }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, prescriptions: []) {
    const recordData = {
      created, patientId, prescriptions
    };
    return this.http.post<{ message: string, record: PrescriptionData }>(BACKEND_URL, recordData);
  }

  update(prescriptionId: string, created: string, patientId: string, prescriptions: []) {
    const recordData = {
      prescriptionId, created, patientId, prescriptions
      };
    return this.http.put(BACKEND_URL + '/' + prescriptionId, recordData);
  }

  delete(prescriptionId: string) {
    return this.http.delete(BACKEND_URL + '/' + prescriptionId);
  }

}
