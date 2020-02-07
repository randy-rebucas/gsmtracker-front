import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiUrl + '/drugs';

export class Drug {
  constructor(public id: string, public name: string) {}
}

export interface Drugs {
  total: number;
  results: Drug[];
}

@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  constructor(
    private http: HttpClient
  ) { }

  search(filter: {name: string} = {name: ''}): Observable<Drugs> {
    console.log(filter);
    return this.http.get<Drugs>(BACKEND_URL + '/lookup')
    .pipe(
      tap((response: Drugs) => {
        response.results = response.results.map(
            drug => new Drug(drug.id, drug.name)
          ).filter(
            drug => drug.name.includes(filter.name)
          );
        return response;
      })
    );
  }
}
