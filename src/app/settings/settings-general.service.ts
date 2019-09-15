import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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

    get(userId: string) {
      return this.http.get<{
        _id: string;
        userId: string,
        clinicName: string,
        clinicOwner: string,
        clinicAddress: string,
        clinicEmail: string,
        prc: number,
        ptr: number,
        s2: string,
        clinicPhone: [],
        clinicHours: []}>(
        BACKEND_URL + '/' + userId
        );
    }

    insert(name: string, owner: string, address: string, email: string, url: string, prc: string, ptr: string, s2: string, phones: [], hours: []) {
      const recordData = {
        name, owner, address, email, url, prc, ptr, s2, phones, hours
      };
      return this.http.post<{ message: string, record: SettingsGeneralData }>(BACKEND_URL, recordData);
    }

    update(id: string, name: string, owner: string, address: string, email: string, url: string, prc: string, ptr: string, s2: string, phones: [], hours: []) {

      const settingData = {
          id: id, name: name, owner: owner, address: address, email: email, url: url, prc: prc, ptr: ptr, s2: s2, phones: phones, hours: hours
        };

      return this.http.put(BACKEND_URL + '/' + id, settingData);
    }

}
