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
    this.http.get<{message: string, settings: any }>(
      BACKEND_URL + '/my-settings/' + userId
    )
    .pipe(
      map(settingData => {
        return { settings: [settingData.settings] };
      })
    )
    .subscribe((transformData) => {
      this.settings = transformData.settings;
      this.settingsUpdated.next({
        settings: [...this.settings]
      });
    });
  }

  getSetting(userId: string) {
   return this.http.get<any>(
      BACKEND_URL + '/' + userId
    );
  }

  getUpdateListener() {
    return this.settingsUpdated.asObservable();
  }

  updateGeneral(updatedSetting: any) {
    return this.http.put<{message: string}>(BACKEND_URL + '/general', updatedSetting);
  }

  updateNotificaiton(updatedNotification: any) {
    return this.http.put<{message: string}>(BACKEND_URL + '/notification', updatedNotification);
  }

  updateSubscription(updatedSubscription: any) {
    return this.http.put<{message: string}>(BACKEND_URL + '/subscription', updatedSubscription);
  }
}
