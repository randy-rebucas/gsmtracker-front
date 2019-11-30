import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl + '/plan';


export interface Plan {
  _id: string;
  name: string;
  slug: string;
  packages: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  private plans: Plan[] = [];
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http
      .get<{ message: string; plans: any; }>(
        BACKEND_URL
      );
  }

  getById(planId: string) {
    return this.http.get<Plan>(
      BACKEND_URL + '/' + planId
    );
  }

  getBySlug(slug: string) {
    return this.http.get<Plan>(
      BACKEND_URL + '/slug/' + slug
    );
  }
}
