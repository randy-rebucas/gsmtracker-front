import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user';

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
}
