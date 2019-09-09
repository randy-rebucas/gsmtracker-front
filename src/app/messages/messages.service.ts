import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { MessagesData } from '../messages/messages-data.model';

import {User, IUserResponse} from '../users/user.class';

const BACKEND_URL = environment.apiUrl + '/messages';

@Injectable({providedIn: 'root'})

export class MessagesService {
  private messages: MessagesData[] = [];
  private messagesUpdated = new Subject<{ messages: MessagesData[] }>();

  constructor(
    private http: HttpClient
    ) {}

  search(filter: {name: string} = {name: ''}, page: number, userId: string): Observable<IUserResponse> {
    const queryParams = `?userId=${userId}&page=${page}`;
    return this.http.get<IUserResponse>(environment.apiUrl + '/patients/network' + queryParams)
    .pipe(
      tap((response: IUserResponse) => {
        response.results = response.results
          .map(user => new User(user.id, user.name))
          .filter(user => user.name.includes(filter.name));
        return response;
      })
    );
  }

  getAll(threadId: string) {
    const queryParams = `?threadId=${threadId}`;
    this.http.get<{message: string, messages: any }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(messageData => {
        return { messages: messageData.messages.map(message => {
          return {
            id: message.id,
            created: message.created,
            message: message.message,
            fullname: message.fullname,
            personId: message.personId
          };
        })};
      })
    )
    .subscribe((transformData) => {
      this.messages = transformData.messages;
      this.messagesUpdated.next({
        messages: [...this.messages]
      });
    });
  }

  getUpdateListener() {
    return this.messagesUpdated.asObservable();
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

  insert( message: string, threadId: string, personId: string) {
    const recordData = {
      message, threadId, personId
    };
    return this.http.post<{ message: string, record: MessagesData }>(BACKEND_URL, recordData);
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
