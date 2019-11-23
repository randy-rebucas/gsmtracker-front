import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Messages } from './messages';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl + '/messages';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messages: Messages[] = [];
  private messagesUpdated = new Subject<{ messages: Messages[] }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(ownerId: string) {
    const queryParams = `?ownerId=${ownerId}`;
    this.http.get<{message: string, messages: any }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(messageData => {
        return { messages: messageData.messages.map(message => {
          console.log(message);
          return {
            id: message.id,
            created: message.created,
            ownerId: message.ownerId,
            fullname: message.fullname,
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

getUpdateListener() {
  return this.messagesUpdated.asObservable();
}

getMessage(messageId) {
  return this.http.get<{ message: any, status: any }>(
    BACKEND_URL + '/last/' + messageId
  );
}

get(messageId: string) {
  // tslint:disable-next-line:max-line-length
  return this.http.get<Messages>(
    BACKEND_URL + '/' + messageId
    );
}

insert(message: string, users: [], ownerId: string) {
  const newMessage = {
    message, users, ownerId
  };
  return this.http.post<{ message: string, messages: Messages }>(BACKEND_URL, newMessage);
}

update(messageId: string, message: string, users: [], ownerId: string) {
  const updatedMessage = {
    messageId, message, users, ownerId
  };
  return this.http.put(BACKEND_URL + '/' + messageId, updatedMessage);
}

delete(messageId: string) {
  return this.http.delete(BACKEND_URL + '/' + messageId);
}
}
