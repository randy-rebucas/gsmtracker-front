import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/access';

export interface Access {
  id: string;
  userId: string;
  blockId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private accessSub = new Subject<{ access: Access[] }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(userId: string) {
    const queryParams = `?labelOwner=${userId}`;
    this.http.get<{message: string, access: any }>(BACKEND_URL + queryParams).pipe(
      map(labelData => {
        return {
          access: labelData.access.map(resLabel => {
            return {
              id: resLabel._id,
              label: resLabel.label
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.accessSub.next({
        access: [...transformData.access]
      });
    });
  }

  getAccess() {
    return this.accessSub.asObservable();
  }

  get(accessId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + accessId);
  }

  insert(newAccess: any) {
    return this.http.post<{ message: string, label: any }>(BACKEND_URL, newAccess);
  }

  update(updatedAccess: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedAccess._id, updatedAccess);
  }

  delete(accessId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + accessId);
  }

  hasAcceess(blockId: string, userId: string) {
    const queryParams = `?blockId=${blockId}&userId=${userId}`;
    return this.http.get<any>(BACKEND_URL + '/checkAccess/' + queryParams);
  }

  getGrantedPhysicians(blockId: string, patientId: string) {
    const queryParams = `?blockId=${blockId}&patientId=${patientId}`;
    return this.http.get<any>(BACKEND_URL + '/getGrantedPhysician/' + queryParams);
  }
}
