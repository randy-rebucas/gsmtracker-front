import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/uploads';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {}

  upload(settingId: string, image: File | string) {

    const uploadData = new FormData();
    uploadData.append('settingId', settingId);
    uploadData.append('profilePicture', image, settingId);

    return this.http.post<{ message: string, imagePath: string }>(BACKEND_URL + '/upload-logo/' + settingId, uploadData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
