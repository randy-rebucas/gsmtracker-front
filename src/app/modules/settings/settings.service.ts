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

  getSetting(userId: string) {
   return this.http.get<any>(
      BACKEND_URL + '/' + userId
    );
  }

  updateGeneral(updatedSetting: any) {
    return this.http.put<{message: string}>(BACKEND_URL + '/general', updatedSetting);
  }

  updateNotificaiton(updatedNotification: any) {
    return this.http.put<{message: string}>(BACKEND_URL + '/notification', updatedNotification);
  }

}
