import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ThreadData } from './thread-data.model';

const BACKEND_URL = environment.apiUrl + '/thread';

@Injectable({providedIn: 'root'})

export class ThreadsService {
  private threads: ThreadData[] = [];
  private threadsUpdated = new Subject<{ threads: ThreadData[] }>();

  constructor(
    private http: HttpClient
    ) {}

    getAll(ownerId: string) {
      const queryParams = `?ownerId=${ownerId}`;
      this.http.get<{message: string, threads: any }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(threadData => {
          return { threads: threadData.threads.map(thread => {
            return {
              id: thread.id,
              created: thread.created,
              ownerId: thread.ownerId,
              fullname: thread.fullname,
              avatar: thread.avatar
            };
          })};
        })
      )
      .subscribe((transformData) => {
        this.threads = transformData.threads;
        this.threadsUpdated.next({
          threads: [...this.threads]
        });
      });
    }

  getUpdateListener() {
    return this.threadsUpdated.asObservable();
  }

  getMessage(threadId) {
    return this.http.get<{ message: any, status: any }>(
      BACKEND_URL + '/last/' + threadId
    );
  }

  get(threadId: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ _id: string, message: string, fullname: string, gender: string, address: string, birthdate: string; contact: string, personId: string, created: string, ownerId: string, avatar: string }>(
      BACKEND_URL + '/' + threadId
      );
  }

  insert(message: string, users: [], ownerId: string, licenseId: string) {
    const recordData = {
      message, users, ownerId, licenseId
    };
    return this.http.post<{ message: string, record: ThreadData }>(BACKEND_URL, recordData);
  }

  update(threadId: string, message: string, users: [], ownerId: string, licenseId: string) {
    const recordData = {
      threadId, message, users, ownerId, licenseId
    };
    return this.http.put(BACKEND_URL + '/' + threadId, recordData);
  }

  delete(threadId: string) {
    return this.http.delete(BACKEND_URL + '/' + threadId);
  }


}
