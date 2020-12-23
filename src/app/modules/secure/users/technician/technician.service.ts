import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Technician } from './technician';

const BACKEND_URL = environment.apiUrl + '/technicians';
@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private technicianUpdated = new Subject<{ technicians: Technician[] }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(userId: string) {
    const queryParams = `?labelOwner=${userId}`;
    this.http.get<{message: string, technicians: any }>(BACKEND_URL + queryParams).pipe(
      map(technicianData => {
        return {
          technicians: technicianData.technicians.map(response => {
            return {
              id: response._id,
              technicians: response.description
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.technicianUpdated.next({
        technicians: [...transformData.technicians]
      });
    });
  }

  getUpdateListener() {
    return this.technicianUpdated.asObservable();
  }

  get(technicianId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + technicianId);
  }

  insert(newTechnician: any) {
    return this.http.post<{ message: string, technicianId: any }>(BACKEND_URL, newTechnician);
  }

  update(updatedTechnician: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedTechnician._id, updatedTechnician);
  }

  delete(technicianId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + technicianId);
  }
}
