import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { User } from './user';


const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[], counts: number }>();

  constructor(
    private http: HttpClient
  ) {}

  getAll(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, users: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return { users: userData.users.map(user => {
          return {
            id: user._id,
            name: user.name,
            contact: user.contact,
            gender: user.gender,
            birthdate: user.birthdate,
            address: user.address,
            created: user.createdAt,
            updated: user.updatedAt,
            meta: user.metas,
            physicians: user.physicians,
            privateKey: user.prikey,
            publicKey: user.pubkey
          };
        }), max: userData.counts};
      })
    )
    .subscribe((transformData) => {
      this.users = transformData.users;
      this.usersUpdated.next({
        users: [...this.users],
        counts: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  get(userId: string) {
    return this.http.get<User>(BACKEND_URL + '/' + userId);
  }

  insert(newUser: any) {
    return this.http.post<{ message: string, user: User, id: string }>(BACKEND_URL, newUser);
  }

  update(updatedUser: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedUser._id, updatedUser);
  }

  updateProfile(updatedUser: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedUser.id + '/profile', updatedUser);
  }

  delete(patientId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + patientId);
  }

}
