import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PatientData } from './patient-data.model';

import {User, IUserResponse} from '../users/user.class';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})
export class PatientsService {
  private patients: PatientData[] = [];
  private patientsUpdated = new Subject<{ patients: PatientData[], patientCount: number }>();

  constructor(
    private http: HttpClient
    ) {}

  search(filter: {name: string} = {name: ''}, page: number, licenseId: string): Observable<IUserResponse> {
    const queryParams = `?licenseId=${licenseId}&page=${page}`;
    return this.http.get<IUserResponse>(BACKEND_URL + '/search' + queryParams)
    .pipe(
      tap((response: IUserResponse) => {
        response.results = response.results
          .map(user => new User(user.id, user.name))
          .filter(user => user.name.includes(filter.name));
        return response;
      })
    );
  }

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

  getAllPatientByYear(licenseId: string) {
    const queryParams = `?licenseId=${licenseId}`;
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
  // {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  getUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  getAllNew(licenseId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ count: number }>(
        BACKEND_URL + '/new/' + licenseId
      );
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
