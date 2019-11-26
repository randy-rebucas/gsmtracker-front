import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/user';

export class User {
  constructor(public id: string, public name: string) {}
}

export interface IUserResponse {
  total: number;
  results: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getBirthdays() {
    return this.http.get<{users: any}>(BACKEND_URL + '/birthdays/');
  }

  getAllNew() {
    return this.http.get<{ count: number }>(
        BACKEND_URL + '/new'
      );
  }

  search(filter: {name: string} = {name: ''}, page: number): Observable<IUserResponse> {
    const queryParams = `?page=${page}`;
    return this.http.get<IUserResponse>(BACKEND_URL + '/search' + queryParams)
    .pipe(
      tap((response: IUserResponse) => {
        console.log(response);
        response.results = response.results
          .map(user => new User(user.id, user.name))
          .filter(user => user.name.includes(filter.name));
        return response;
      })
    );
  }
}
