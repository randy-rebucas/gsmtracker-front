import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { SettingsGeneralData } from './settings-general-data.model';

const BACKEND_URL = environment.apiUrl + '/setting';

@Injectable({providedIn: 'root'})

export class SettingsGeneralService {
  private settings: SettingsGeneralData[] = [];
  private settingsUpdated = new Subject<{ settings: SettingsGeneralData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getUpdateListener() {
      return this.settingsUpdated.asObservable();
    }

    get(licenseId: string) {
      return this.http.get<{
        _id: string,
        logoPath: string,
        clinicName: string,
        clinicOwner: string,
        clinicAddress: string,
        clinicEmail: string,
        prc: number,
        ptr: number,
        s2: string,
        nobreak: boolean,
        clinicPhone: [],
        clinicHours: []}>(
        BACKEND_URL + '/' + licenseId
        );
    }

    insert(name: string, owner: string, address: string, email: string, url: string, prc: string, ptr: string, s2: string, phones: [], hours: []) {
      const recordData = {
        name, owner, address, email, url, prc, ptr, s2, phones, hours
      };
      return this.http.post<{ message: string, record: SettingsGeneralData }>(BACKEND_URL, recordData);
    }

    update(id: string, licenseId: string, name: string, owner: string, address: string, email: string, prc: string, ptr: string, s2: string, nobreak: boolean, phones: [], hours: []) {

      const settingData = {
          id: id, name: name, owner: owner, address: address, email: email, prc: prc, ptr: ptr, s2: s2, nobreak: nobreak, phones: phones, hours: hours
        };

      return this.http.put(BACKEND_URL + '/' + licenseId, settingData);
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
