import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Technician } from './technician';

const BACKEND_URL = environment.apiUrl + '/technicians';

export class TechnicianLookup {
  constructor(public id: string, public name: string) {}
}

export interface Technicians {
  total: number;
  results: TechnicianLookup[];
}

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

  search(filter: {name: string} = {name: ''}): Observable<Technicians> {
    return this.http.get<Technicians>(BACKEND_URL + '/lookup')
    .pipe(
      tap((response: Technicians) => {
        response.results = response.results.map(
            technician => new TechnicianLookup(technician.id, technician.name)
          ).filter(
            technician => technician.name.includes(filter.name)
          );
        return response;
      })
    );
  }
}
