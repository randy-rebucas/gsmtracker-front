import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Physicians } from './physicians';


const BACKEND_URL = environment.apiUrl + '/physicians';

@Injectable({
  providedIn: 'root'
})
export class PhysiciansService {

  private physicians: Physicians[] = [];
  private physiciansUpdated = new Subject<{ physicians: Physicians[], counts: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getMyPatient(userId: string, perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}&userId=${userId}`;
    this.http.get<{message: string, physicians: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    ).subscribe((transformData) => {
      this.physicianSub(transformData);
    });
  }

  getAll(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, physicians: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.physicianSub(transformData);
    });
  }

  physicianSub(transformData: any) {
    this.physicians = transformData.physicians;
    this.physiciansUpdated.next({
      physicians: [...this.physicians],
      counts: transformData.max
    });
  }

  getMap(userData: any) {
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
    return this.physiciansUpdated.asObservable();
  }

  get(physicianId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + physicianId);
  }

  insert(newPhysician: any) {
    return this.http.post<{ message: string, physicianId: string }>(BACKEND_URL, newPhysician);
  }

  update(updatedPhysician: any) {
    return this.http.put<Physicians>(BACKEND_URL + '/' + updatedPhysician._id, updatedPhysician);
  }

  delete(physicianId: string) {
    return this.http.delete<{ message: string, id: string }>(BACKEND_URL + '/' + physicianId);
  }
}
