import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/user';

export interface User {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUpdated = new Subject<{ users: User[] }>();
  private usersSub = new Subject<any>();

  constructor(private http: HttpClient) { }

  getAll(userId: string) {
    const queryParams = `?labelOwner=${userId}`;
    this.http.get<{message: string, users: any }>(BACKEND_URL + queryParams).pipe(
      map(userData => {
        return {
          users: userData.users.map(responseUser => {
            console.log(responseUser);
            return {
              id: responseUser._id,
              users: responseUser.description
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.usersUpdated.next({
        users: [...transformData.users]
      });
    });
  }

  getUsers() {
    return this.usersUpdated.asObservable();
  }

  setSubListener(data: any) {
    this.usersSub.next(data);
  }

  getSubListener() {
    return this.usersSub.asObservable();
  }

  insert(newUser: any) {
    return this.http.post<{ message: string, user: string, id: string }>(BACKEND_URL, newUser);
  }

  get(userId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + userId);
  }

  update(updatedUser: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedUser._id, updatedUser);
  }

  delete(userId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + userId);
  }

}
