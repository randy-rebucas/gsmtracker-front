import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Owners } from './owners';
const BACKEND_URL = environment.apiUrl + '/owners';

@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  private owners: Owners[] = [];
  private ownersUpdated = new Subject<{ owners: Owners[], counts: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getMyPatient(userId: string, perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}&userId=${userId}`;
    this.http.get<{message: string, owners: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    ).subscribe((transformData) => {
      this.ownerSub(transformData);
    });
  }

  getAll(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, owners: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.ownerSub(transformData);
    });
  }

  ownerSub(transformData: any) {
    this.owners = transformData.owners;
    this.ownersUpdated.next({
      owners: [...this.owners],
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
        owners: user.owners,
        privateKey: user.userId.privateKey,
        publicKey: user.userId.publicKey
      };
    }), max: userData.counts};
  }

  getUpdateListener() {
    return this.ownersUpdated.asObservable();
  }

  get(ownerId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + ownerId);
  }

  insert(newOwner: any) {
    return this.http.post<{ message: string, ownerId: string }>(BACKEND_URL, newOwner);
  }

  update(updatedOwner: any) {
    return this.http.put<Owners>(BACKEND_URL + '/' + updatedOwner._id, updatedOwner);
  }

  delete(ownerId: string) {
    return this.http.delete<{ message: string, id: string }>(BACKEND_URL + '/' + ownerId);
  }
}
