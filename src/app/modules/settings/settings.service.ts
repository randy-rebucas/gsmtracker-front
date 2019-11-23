import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Settings } from './settings';
import { Subject } from 'rxjs';
const BACKEND_URL = environment.apiUrl + '/setting';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings[] = [];
  private settingsUpdated = new Subject<{ settings: Settings[], count: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getUpdateListener() {
    return this.settingsUpdated.asObservable();
  }

  getOwnSetting(userId: string) {
    return this.http.get<Settings>(
      BACKEND_URL + '/' + userId
    );
  }

  insert(newSetting: any) {

    return this.http.post<{ message: string, record: Settings }>(BACKEND_URL, newSetting);
  }

  update(updatedSetting) {
    console.log(updatedSetting);
    return this.http.put(BACKEND_URL, updatedSetting);
  }

  // upload(settingId: string, image: File | string) {

  //   const uploadData = new FormData();
  //   uploadData.append('settingId', settingId);
  //   uploadData.append('profilePicture', image, settingId);

  //   return this.http.post<{ message: string, imagePath: string }>(BACKEND_URL + '/upload-logo/' + settingId, uploadData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   });
  // }
}
