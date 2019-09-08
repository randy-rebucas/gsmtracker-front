import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AppointmentData } from './appointment-data.model';

const BACKEND_URL = environment.apiUrl + '/appointments';

@Injectable({providedIn: 'root'})

export class AppointmentService {
  private appointments: AppointmentData[] = [];
  private appointmentsUpdated = new Subject<{ appointments: AppointmentData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(clientId: string, perPage: number, currentPage: number) {
      const queryParams = `?clientId=${clientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, appointment: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(appointmentData => {
          return { appointments: appointmentData.appointment.map(appointment => {
            return {
              id: appointment._id,
              title: appointment.title,
              start: appointment.start,
              end: appointment.end,
              backgroundColor: appointment.backgroundColor,
              textColor: appointment.textColor,
              borderColor: appointment.borderColor,
              fullname: appointment.fullname,
              status: appointment.status
            };
          }), max: appointmentData.max};
        })
      )
      .subscribe((transformData) => {

        this.appointments = transformData.appointments;
        this.appointmentsUpdated.next({
          appointments: [...this.appointments],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.appointmentsUpdated.asObservable();
  }

  get(appointmentId: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ _id: string, title: string, start: Date, end: Date, clientId: string, fullname: string, gender: string, address: string, birthdate: string, contact: string, type: number, status: number, detailId: string }>(
      BACKEND_URL + '/' + appointmentId
      );
  }

  insert(users: string, title: string, start: string, end: string, clientId: string) {
    const appointmentData = {
      users, title, start, end, clientId
    };
    return this.http.post<{ message: string, record: AppointmentData }>(BACKEND_URL, appointmentData);
  }

  updateStatus(detailId: string, status: number, appointmentId: string) {
    const detailData = {
      detailId, status, appointmentId
    };
    return this.http.put(BACKEND_URL + '/updateStatus/' + detailId, detailData);
  }

  delete(appointmentId: string) {
    return this.http.delete(BACKEND_URL + '/' + appointmentId);
  }


}
