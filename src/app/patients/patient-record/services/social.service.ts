import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { SocialData } from '../models/social-data';

const BACKEND_URL = environment.apiUrl + '/socials';

@Injectable({providedIn: 'root'})

export class SocialService {
  private socials: SocialData[] = [];
  private socialsUpdated = new Subject<{ socials: SocialData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, socials: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(socialsData => {
          return { socials: socialsData.socials.map(social => {
            return {
              id: social._id,
              created: social.created,
              patientId: social.patientId,
              socials: social.social
            };
          }), max: socialsData.max};
        })
      )
      .subscribe((transformData) => {
        this.socials = transformData.socials;
        this.socialsUpdated.next({
          socials: [...this.socials],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.socialsUpdated.asObservable();
  }

  get(socialId: string) {
    return this.http.get<{ _id: string, social: string }>(
      BACKEND_URL + '/' + socialId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; social: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, social: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patientId: string, social: string) {
    const recordData = {
      created, patientId, social
    };
    return this.http.post<{ message: string, record: SocialData }>(BACKEND_URL, recordData);
  }

  update(socialId: string, created: string, patientId: string, social: string) {
    const recordData = {
      socialId, created, patientId, social
    };
    return this.http.put(BACKEND_URL + '/' + socialId, recordData);
  }

  delete(socialId: string) {
    return this.http.delete(BACKEND_URL + '/' + socialId);
  }


}
