import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../environments/environment';
import { NotificationData } from './notification-data.model';

const BACKEND_URL = environment.apiUrl + '/notification';

@Injectable({providedIn: 'root'})

export class SettingsGeneralService {
  private notifications: NotificationData[] = [];
  private notificationsUpdated = new Subject<{ notifications: NotificationData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getUpdateListener() {
      return this.notificationsUpdated.asObservable();
    }

    get(licenseId: string) {
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
        BACKEND_URL + '/' + licenseId
        );
    }

    // tslint:disable-next-line:max-line-length
    update(Id: string, licenseId: string, Name: string, Owner: string, Address: [], Email: string, Prc: string, Ptr: string, S2: string, Nobreak: boolean, Phones: [], Hours: []) {

      const settingData = {
          // tslint:disable-next-line:max-line-length
          id: Id, name: Name, owner: Owner, address: Address, email: Email, prc: Prc, ptr: Ptr, s2: S2, nobreak: Nobreak, phones: Phones, hours: Hours
        };

      return this.http.put(BACKEND_URL + '/' + licenseId, settingData);
    }

}
