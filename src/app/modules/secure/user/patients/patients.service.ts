import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { Patients } from './patients';


const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private patients: Patients[] = [];
  private patientsUpdated = new Subject<{ patients: Patients[], counts: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getMyPatient(userId: string, perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}&userId=${userId}`;
    this.http.get<{message: string, patients: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    ).subscribe((transformData) => {
      this.patientSub(transformData);
    });
  }

  getAll(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, patients: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.patientSub(transformData);
    });
  }

  patientSub(transformData) {
    this.patients = transformData.patients;
    this.patientsUpdated.next({
      patients: [...this.patients],
      counts: transformData.max
    });
  }

  getMap(userData) {
    return { patients: userData.patients.map(user => {
      return {
        id: user._id,
        firstname: user.userId.name.firstname,
        midlename: user.userId.name.midlename,
        lastname: user.userId.name.lastname,
        contact: user.userId.contact,
        gender: user.userId.gender,
        birthdate: user.userId.birthdate,
        address: user.userId.addresses,
        created: user.userId.createdAt,
        updated: user.userId.updatedAt,
        physicians: user.physicians,
        privateKey: user.userId.privateKey,
        publicKey: user.userId.publicKey
      };
    }), max: userData.counts};

  }
  getUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  get(patientId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + patientId);
  }

  insert(newPatient: any) {
    return this.http.post<{ message: string, patient: Patients }>(BACKEND_URL, newPatient);
  }

  update(updatedPatient: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedPatient.id, updatedPatient);
  }

  delete(patientId: string) {
    return this.http.delete<{ message: string, id: string }>(BACKEND_URL + '/' + patientId);
  }

  deleteMany(patientIds: []) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + patientIds);
  }
}
