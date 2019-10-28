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

    getAll(perPage: number, currentPage: number) {
      const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
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
              avatar: appointment.avatar,
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
    return this.http.get<{ appointmentId: string, title: string, start: Date, end: Date, avatar: string, fullname: string, gender: string, address: string, birthdate: string, contact: string, type: number, status: number, detailId: string }>(
      BACKEND_URL + '/' + appointmentId
      );
  }

  getAllNew() {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ count: number }>(
        BACKEND_URL + '/new/'
      );
  }

  insert(users: string, title: string, start: string) {
    const appointmentData = {
      users, title, start
    };
    return this.http.post<{ message: string, record: AppointmentData }>(BACKEND_URL, appointmentData);
  }

  update(appointmentId: string, status: number) {
    const detailData = {
      appointmentId, status
    };
    return this.http.put(BACKEND_URL + '/' + appointmentId, detailData);
  }

  delete(appointmentId: string) {
    return this.http.delete(BACKEND_URL + '/' + appointmentId);
  }


}
