import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HeightData } from '../models/height-data.model';

const BACKEND_URL = environment.apiUrl + '/heights';

@Injectable({providedIn: 'root'})

export class HeightService {
  private heights: HeightData[] = [];
  private heightsUpdated = new Subject<{ heights: HeightData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, heights: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(hieghtData => {
        return { heights: hieghtData.heights.map(height => {
          return {
            id: height._id,
            height: height.height,
            created: height.created
          };
        }), max: hieghtData.max};
      })
    )
    .subscribe((transformData) => {
      this.heights = transformData.heights;
      this.heightsUpdated.next({
        heights: [...this.heights],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.heightsUpdated.asObservable();
  }

  get(heightId: string) {
    return this.http.get<{ _id: string; height: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + heightId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; height: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; height: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(height: string, created: string, patientId: string) {
    const recordData = {
      height, created, patientId
    };
    return this.http.post<{ message: string, record: HeightData }>(BACKEND_URL, recordData);
  }

  update(heightId: string, height: string, created: string, patientId: string) {
    const recordData = {
      heightId, height, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + heightId, recordData);
  }

  delete(heightId: string) {
    return this.http.delete(BACKEND_URL + '/' + heightId);
  }

}
