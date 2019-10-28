import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TypesData } from './types-data.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/type';

@Injectable({providedIn: 'root'})

export class TypesService {
  private types: TypesData[] = [];
  private typesUpdated = new Subject<{ types: TypesData[] }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(licenseId: string) {
    this.http.get<{message: string, types: any }>(
      BACKEND_URL
    )
    .pipe(
      map(data => {
        return { types: data.types.map(
          type => {
            return {
              id: type._id,
              name: type.name,
              slug: type.slug,
              generated: type.generated,
              description: type.description
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.types = transformData.types;
      this.typesUpdated.next({
        types: [...this.types]
      });
    });
  }

  getUpdateListener() {
    return this.typesUpdated.asObservable();
  }

  get(typeId: string) {
    return this.http.get<{ _id: string; name: string, description: string, generated: string }>(
      BACKEND_URL + '/' + typeId
      );
  }

  insert(name: string, description: string, generated: string) {
    const data = {
        name, description, generated
    };
    return this.http.post<{ message: string, type: TypesData }>(BACKEND_URL, data);
  }

  update(typeId: string, name: string, description: string, generated: string) {
    const data = {
        name, description, generated
    };
    return this.http.put(BACKEND_URL + '/' + typeId , data);
  }

  delete(typeId: string) {
    return this.http.delete(BACKEND_URL + '/' + typeId);
  }

}
