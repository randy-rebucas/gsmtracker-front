import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Settings } from './settings';

const BACKEND_URL = environment.apiUrl + '/setting';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getOwnSetting(userId: string) {
   return this.http.get<Settings>(
      BACKEND_URL + '/' + userId
    );
  }

  insert(newSetting: any) {
    return this.http.post<{ message: string, record: Settings }>(BACKEND_URL, newSetting);
  }

  update(updatedSetting: any) {
    return this.http.put(BACKEND_URL, updatedSetting);
  }

}
