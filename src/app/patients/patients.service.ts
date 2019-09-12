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

  getAll(userId: string, patientPerPage: number, currentPage: number) {
    const queryParams = `?userId=${userId}&pagesize=${patientPerPage}&page=${currentPage}`;
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
            created: patient.personId.created
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

  get(patientId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ _id: string, bloodType: string, comments: string, personId: string, userId: string, firstname: any, midlename: any, lastname: string, contact: string, gender: string, birthdate: string, address: string }>(
        BACKEND_URL + '/' + patientId
      );
  }

  // tslint:disable-next-line:max-line-length
  insert(Firstname: string, Midlename: string, Lastname: string, Contact: string, BloodType: string, Gender: string, Birthdate: string, Address: string, Comments: string) {
      const patientData = {
        firstname: Firstname,
        midlename: Midlename,
        lastname: Lastname,
        contact: Contact,
        bloodType: BloodType,
        gender: Gender,
        birthdate: Birthdate,
        address: Address,
        comments: Comments
      };
      return this.http.post<{ message: string, patient: PatientData }>(BACKEND_URL, patientData);
  }

  // tslint:disable-next-line:max-line-length
  update(Id: string, PersonId: string, Firstname: string, Midlename: string, Lastname: string, Contact: string, BloodType: string, Gender: string, Birthdate: string, Address: string, Comments: string) {
    const patientData = {
      id: Id,
      firstname: Firstname,
      midlename: Midlename,
      lastname: Lastname,
      contact: Contact,
      bloodType: BloodType,
      gender: Gender,
      birthdate: Birthdate,
      address: Address,
      comments: Comments
    };
    return this.http.put(BACKEND_URL + '/' + Id + '/' + PersonId, patientData);
  }

  delete(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
