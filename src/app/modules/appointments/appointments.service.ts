import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointments } from './appointments';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl + '/appointments';
@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointments: Appointments[] = [];
  private appointmentsUpdated = new Subject<{ appointments: Appointments[], count: number }>();

  constructor(
    private http: HttpClient
  ) { }

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
    return this.http.get<Appointments>(
      BACKEND_URL + '/' + appointmentId
    );
  }

  insert(newAppointment: any) {
    return this.http.post<{ message: string, appointment: Appointments }>(BACKEND_URL, newAppointment);
  }

  update(updatedAppointment: any) {
    return this.http.put(BACKEND_URL + '/' + updatedAppointment.appointmentId, updatedAppointment);
  }

  delete(appointmentIds: []) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + appointmentIds);
  }
}
