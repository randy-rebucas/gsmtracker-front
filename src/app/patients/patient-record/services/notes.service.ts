import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { NoteData } from '../models/note.model';

const BACKEND_URL = environment.apiUrl + '/progress-notes';

@Injectable({providedIn: 'root'})

export class NotesService {
  private notes: NoteData[] = [];
  private notesUpdated = new Subject<{ notes: NoteData[], count: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patientId=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, notes: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(noteData => {
        return { notes: noteData.notes.map(note => {
          return {
            id: note._id,
            created: note.created,
            complaintId: note.complaintId,
            patientId: note.patientId,
            note: note.note
          };
        }), max: noteData.max};
      })
    )
    .subscribe((transformData) => {
      this.notes = transformData.notes;
      this.notesUpdated.next({
        notes: [...this.notes],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  get(progressNoteId: string) {
    return this.http.get<{ _id: string, note: string, created: string, complaintId: string, patientId: string}>(
      BACKEND_URL + '/' + progressNoteId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string, note: string, created: string, complaintId: string, patientId: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getByComplaintId(complaintId) {
    return this.http.get<{ _id: string, note: string, created: string, complaintId: string, patientId: string }>(
      BACKEND_URL + '/complaint/' + complaintId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, note: string, created: string, complaintId: string, patientId: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(note: string, created: string, complaintId: string, patientId: string) {
    const recordData = {
      note, created, complaintId, patientId
    };
    return this.http.post<{ message: string, record: NoteData }>(BACKEND_URL, recordData);
  }

  update(progressNoteId: string, note: string, created: string, complaintId: string, patientId: string) {
    const recordData = {
      progressNoteId, note, created, complaintId, patientId
    };
    return this.http.put(BACKEND_URL + '/' + progressNoteId, recordData);
  }

  delete(progressNoteId: string) {
    return this.http.delete(BACKEND_URL + '/' + progressNoteId);
  }

}
