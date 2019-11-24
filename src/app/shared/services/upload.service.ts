import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/upload';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {}

  upload(sourceId: string, image: string | ArrayBuffer) {
    const uploadData = {
      origId: sourceId,
      origImage: image
    };
    return this.http.post<{ message: string, imagePath: string }>(BACKEND_URL, uploadData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  get(sourceId: string) {
    return this.http.get<{image: any}>(
      BACKEND_URL + '/' + sourceId
    );
  }
}
