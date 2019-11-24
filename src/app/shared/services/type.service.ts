import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
const BACKEND_URL = environment.apiUrl + '/type';

export interface Type {
  _id: string;
  name: string;
  slug: string;
  description: string;
  key: string;
  generated: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private http: HttpClient) { }

  getById(typeId: string) {
    return this.http.get<Type>(
      BACKEND_URL + '/' + typeId
    );
  }

  getBySlug(slug: string) {
    return this.http.get<Type>(
      BACKEND_URL + '/slug/' + slug
    );
  }
}
