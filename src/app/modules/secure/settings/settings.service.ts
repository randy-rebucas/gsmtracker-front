import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Settings } from './settings';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Setting {
  settingId: string;
  general: any;
  notification: any;
  subscription: string;
}
const BACKEND_URL = environment.apiUrl + '/setting';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: Setting[] = [];
  private settingsUpdated = new Subject<{ settings: Setting[] }>();

  constructor(
    private http: HttpClient
  ) { }


  get(userId: string) {
   return this.http.get<any>(BACKEND_URL + '/' + userId);
  }

  update(updatedSetting: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedSetting.userId, updatedSetting);
  }

}
