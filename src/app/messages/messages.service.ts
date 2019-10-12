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
            personId: message.personId,
            avatar: message.avatar
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

  getMessages(threadId: string) {
    const queryParams = `?threadId=${threadId}`;
    return this.http.get<{message: string, messages: any }>(
      BACKEND_URL + queryParams
    );
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

  insert( message: string, threadId: string, userId: string) {
    const recordData = {
      message, threadId, userId
    };
    return this.http.post<{ message: string, record: MessagesData }>(BACKEND_URL, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

  getAllUnread(licenseId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ count: number }>(
        BACKEND_URL + '/unread/' + licenseId
      );
  }
}
