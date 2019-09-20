import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PatientData } from './patient-data.model';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})
export class PatientsService {
  private patients: PatientData[] = [];
  private patientsUpdated = new Subject<{ patients: PatientData[], patientCount: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(licenseId: string, patientPerPage: number, currentPage: number) {
    const queryParams = `?licenseId=${licenseId}&pagesize=${patientPerPage}&page=${currentPage}`;
    this.http.get<{message: string, patients: any, maxPatients: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(patientData => {
        return { patients: patientData.patients.map(patient => {
          return {
            id: patient._id,
            bloodType: patient.bloodType,
            comments: patient.comments,
            userId: patient.userId,
            personId: patient.personId._id,
            firstname: patient.personId.firstname,
            midlename: patient.personId.midlename,
            lastname: patient.personId.lastname,
            contact: patient.personId.contact,
            gender: patient.personId.gender,
            birthdate: patient.personId.birthdate,
            address: patient.personId.address,
            created: patient.personId.created,
            meta: patient.metaData
          };
        }), maxPatients: patientData.maxPatients};
      })
    )
    .subscribe((transformpatientsData) => {
      this.patients = transformpatientsData.patients;
      this.patientsUpdated.next({
        patients: [...this.patients],
        patientCount: transformpatientsData.maxPatients
      });
    });
  }

  getUpdateListener() {
    return this.patientsUpdated.asObservable();
  }
  
  get(userId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ userId: string, personId: string, firstname: any, midlename: any, lastname: string, contact: string, gender: string, birthdate: string, addresses: [], meta: [] }>(
        BACKEND_URL + '/' + userId
      );
  }

  // tslint:disable-next-line:max-line-length
  insert(Firstname: string, Midlename: string, Lastname: string, Contact: string, Gender: string, Birthdate: string, Addresses: [], Meta: [], reqEmail: string, resPass: string, reqLicenseId: string) {
      const patientData = {
        firstname: Firstname,
        midlename: Midlename,
        lastname: Lastname,
        contact: Contact,
        gender: Gender,
        birthdate: Birthdate,
        address: Addresses,
        meta: Meta,
        email: reqEmail,
        password: resPass,
        licenseId: reqLicenseId
      };
      return this.http.post<{ message: string, patient: PatientData }>(BACKEND_URL, patientData);
  }

  // tslint:disable-next-line:max-line-length
  update(Id: string, Firstname: string, Midlename: string, Lastname: string, Contact: string, Gender: string, Birthdate: string, Addresses: [], Meta: []) {
    const patientData = {
      id: Id,
      firstname: Firstname,
      midlename: Midlename,
      lastname: Lastname,
      contact: Contact,
      gender: Gender,
      birthdate: Birthdate,
      address: Addresses,
      meta: Meta
    };
    return this.http.put(BACKEND_URL + '/' + Id, patientData);
  }

  delete(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
