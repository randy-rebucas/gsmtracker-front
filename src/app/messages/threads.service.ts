import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { MessagesData } from './messages-data.model';

import {User, IUserResponse} from '../users/user.class';
import { PatientData } from '../patients/patient-data.model';
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
            console.log(thread);
            return {
              id: thread._id,
              created: thread.created,
              message: thread.message,
              ownerId: thread.ownerId,
              fullname: thread.userId.firstname + ', ' + thread.userId.lastname
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

  get(id: string) {
    return this.http.get<{ _id: string, subject: string, message: string, patientId: string, created: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getByMessageId(messageId) {
    return this.http.get<{ _id: string, subject: string, message: string, patientId: string, created: string }>(
      BACKEND_URL + '/message/' + messageId
      );
  }

  insert(message: string, users: [], ownerId: string) {
    const recordData = {
      message, users, ownerId
    };
    return this.http.post<{ message: string, record: ThreadData }>(BACKEND_URL, recordData);
  }

  update(id: string, subject: string, message: string, patientId: string, created: string, practitionerId: string) {
    const recordData = {
        id, subject, message, patientId, created, practitionerId
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }


}
