import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Settings } from 'src/app/shared/interfaces/settings';
import { environment } from 'src/environments/environment';


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
  private settingsUpdated = new Subject<Settings>();

  constructor(
    private http: HttpClient
  ) { }


  get(userId: string) {
   return this.http.get<any>(BACKEND_URL + '/' + userId);
  }

  getSetting(userId: string) {
    this.http.get<Settings>(BACKEND_URL + '/' + userId)
    .subscribe((res) => {
      this.settingsUpdated.next(res);
    });
  }

  getSettingListener() {
    return this.settingsUpdated.asObservable();
  }

  setSetting(updatedSetting: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedSetting.userId, updatedSetting);
  }

}
