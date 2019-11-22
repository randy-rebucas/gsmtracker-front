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

  get() {
    return this.http.get<{
      _id: string,
      logoPath: string,
      clinicName: string,
      clinicOwner: string,
      clinicEmail: string,
      prc: number,
      ptr: number,
      s2: string,
      nobreak: boolean,
      address: []
      clinicPhone: [],
      clinicHours: []}>(
      BACKEND_URL
      );
  }

  // tslint:disable-next-line:max-line-length
  insert(name: string, owner: string, address: string, email: string, url: string, prc: string, ptr: string, s2: string, phones: [], hours: []) {
    const recordData = {
      name, owner, address, email, url, prc, ptr, s2, phones, hours
    };
    return this.http.post<{ message: string, record: Settings }>(BACKEND_URL, recordData);
  }

  // tslint:disable-next-line:max-line-length
  update(Id: string, Name: string, Owner: string, Address: [], Email: string, Prc: string, Ptr: string, S2: string, Nobreak: boolean, Phones: [], Hours: []) {

    const settingData = {
        // tslint:disable-next-line:max-line-length
        id: Id, name: Name, owner: Owner, address: Address, email: Email, prc: Prc, ptr: Ptr, s2: S2, nobreak: Nobreak, phones: Phones, hours: Hours
      };

    return this.http.put(BACKEND_URL, settingData);
  }

  upload(settingId: string, image: File | string) {

    const uploadData = new FormData();
    uploadData.append('settingId', settingId);
    uploadData.append('profilePicture', image, settingId);

    return this.http.post<{ message: string, imagePath: string }>(BACKEND_URL + '/upload-logo/' + settingId, uploadData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
