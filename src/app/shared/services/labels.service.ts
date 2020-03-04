import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/labels';

export interface Label {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private labelSub = new Subject<{ labels: Label[] }>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(userId: string) {
    this.http.get<{message: string, labels: any }>(BACKEND_URL).pipe(
      map(labelData => {
        return {
          labels: labelData.labels.map(resLabel => {
            return {
              id: resLabel._id,
              label: resLabel.label
            };
          })
        };
      })
    )
    .subscribe((transformData) => {
      this.labelSub.next({
        labels: [...transformData.labels]
      });
    });
  }

  getLabels() {
    return this.labelSub.asObservable();
  }

  get(labelId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + labelId);
  }

  insert(newLabel: any) {
    return this.http.post<{ message: string, label: any }>(BACKEND_URL, newLabel);
  }

  update(updatedLabel: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedLabel._id, updatedLabel);
  }

  delete(labelId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/' + labelId);
  }

}
