import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { TemperatureData } from '../models/temperature-data.model';

const BACKEND_URL = environment.apiUrl + '/temperatures';

@Injectable({providedIn: 'root'})

export class TemperatureService {
  private temperatures: TemperatureData[] = [];
  private temperaturesUpdated = new Subject<{ temperatures: TemperatureData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, temperatures: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(temperatureData => {
          return { temperatures: temperatureData.temperatures.map(temperature => {
            return {
              id: temperature._id,
              temperature: temperature.temperature,
              created: temperature.created,
              patientId: temperature.patientId
            };
          }), max: temperatureData.max};
        })
      )
      .subscribe((transformData) => {
        this.temperatures = transformData.temperatures;
        this.temperaturesUpdated.next({
            temperatures: [...this.temperatures],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.temperaturesUpdated.asObservable();
  }

  get(temperatureId: string) {
    return this.http.get<{ _id: string; temperature: string, created: string, patientId: string }>(
      BACKEND_URL + '/' + temperatureId
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; temperature: string, created: string, patientId: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; temperature: string, created: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(temperature: string, created: string, patientId: string) {
    const recordData = {
        temperature, created, patientId
    };
    return this.http.post<{ message: string, record: TemperatureData }>(BACKEND_URL, recordData);
  }

  update(temperatureId: string, temperature: string, created: string, patientId: string) {
    const recordData = {
      temperatureId, temperature, created, patientId
    };
    return this.http.put(BACKEND_URL + '/' + temperatureId, recordData);
  }

  delete(temperatureId: string) {
    return this.http.delete(BACKEND_URL + '/' + temperatureId);
  }

}
