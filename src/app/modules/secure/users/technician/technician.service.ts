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
  private technicianUpdated = new Subject<{ technicians: Technician[], counts: number }>();
  private selectedSub = new Subject<any>();

  constructor(
    private http: HttpClient
  ) {}

  getAll(userId: string) {
    const queryParams = `?ownerId=${userId}`;
    this.http.get<{message: string, technicians: any, counts: number }>(BACKEND_URL + queryParams)
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.technicianSub(transformData);
    });
  }

  technicianSub(transformData) {
    this.technicianUpdated.next({
      technicians: [...transformData.technicians],
      counts: transformData.max
    });
  }

  getMap(technicianData) {
    return { technicians: technicianData.technicians.map(technician => {
      const technicianFirstname = technician.userId.name.firstname;
      const technicianLastname = technician.userId.name.lastname;

      const address1 = technician.userId.addresses[0].address1;
      const address2 = technician.userId.addresses[0].address2;

      return {
        id: technician._id,
        gender: technician.userId.gender,
        name: technicianLastname.concat(', ', technicianFirstname.toString()),
        contact: technician.userId.contact,
        address: address2.concat(', ', address1.toString()),
        ownerId: technician.ownerId,
        shopOwnerId: technician.userId._id
      };
    }), max: technicianData.counts};
  }

  getUpdateListener() {
    return this.technicianUpdated.asObservable();
  }

  get(technicianrId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + technicianrId);
  }

  insert(newTechnician: any) {
    return this.http.post<{ message: string, technicianId: any }>(BACKEND_URL, newTechnician);
  }

  update(updatedTechnician: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedTechnician._id, updatedTechnician);
  }

  deleteMany(technicianIds: []) {
    const queryParams = `?technicianIds=${technicianIds}`;
    return this.http.delete<{ message: string }>(BACKEND_URL + queryParams);
  }

  setSelectedItem(selectedItem: any) {
    this.selectedSub.next(selectedItem);
  }

  getSelectedItem() {
    return this.selectedSub.asObservable();
  }

  search(filter: {name: string} = {name: ''}, ownerId: string): Observable<Technicians> {
    return this.http.get<Technicians>(BACKEND_URL + '/lookup/' + ownerId)
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
