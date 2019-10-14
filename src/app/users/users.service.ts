import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { UserData } from './user-data.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({providedIn: 'root'})
export class UsersService {
  private users: UserData[] = [];
  private usersUpdated = new Subject<{ users: UserData[], counts: number }>();

  constructor(
    private http: HttpClient
    ) {}

  getAll(userType: string, licenseId: string, perPage: number, currentPage: number) {
    const queryParams = `?usertype=${userType}&licenseId=${licenseId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, users: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return { users: userData.users.map(user => {
          return {
            id: user._id,
            personId: user.personId._id,
            firstname: user.personId.firstname,
            midlename: user.personId.midlename,
            lastname: user.personId.lastname,
            contact: user.personId.contact,
            gender: user.personId.gender,
            birthdate: user.personId.birthdate,
            address: user.personId.address,
            created: user.personId.created,
            meta: user.metaData,
            avatar: user.avatarPath
          };
        }), max: userData.counts};
      })
    )
    .subscribe((transformData) => {
      this.users = transformData.users;
      this.usersUpdated.next({
        users: [...this.users],
        counts: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  get(userId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ userId: string, personId: string, firstname: any, midlename: any, lastname: string, contact: string, gender: string, birthdate: string, addresses: [], meta: [], email: string, avatar: string, userType: string, created: Date }>(
        BACKEND_URL + '/' + userId
      );
  }
  // tslint:disable-next-line:max-line-length
  insert(Firstname: string, Midlename: string, Lastname: string, Contact: string, Gender: string, Birthdate: string, Addresses: [], Meta: [], reqEmail: string, resPass: string, reqLicenseId: string) {
      const userData = {
        firstname: Firstname,
        midlename: Midlename,
        lastname: Lastname,
        contact: Contact,
        gender: Gender,
        birthdate: Birthdate,
        address: Addresses,
        meta: Meta,
        email: reqEmail,
        password: resPass,
        licenseId: reqLicenseId
      };
      return this.http.post<{ message: string, user: UserData }>(BACKEND_URL, userData);
  }

  // tslint:disable-next-line:max-line-length
  update(Id: string, UserType: string, Firstname: string, Midlename: string, Lastname: string, Contact: string, Gender: string, Birthdate: string, Addresses: [], Meta: []) {
    const userData = {
      id: Id,
      userType: UserType,
      firstname: Firstname,
      midlename: Midlename,
      lastname: Lastname,
      contact: Contact,
      gender: Gender,
      birthdate: Birthdate,
      address: Addresses,
      meta: Meta
    };
    return this.http.put(BACKEND_URL + '/' + Id, userData);
  }

  delete(userId: string) {
    return this.http.delete(BACKEND_URL + '/' + userId);
  }

  deleteAll(patientIds: []) {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/many/' + patientIds);
  }

  upload(uId: string, type: string, image: File | string) {

    const uploadData = new FormData();
    uploadData.append('userId', uId);
    uploadData.append('userType', type);
    uploadData.append('profilePicture', image, uId);

    return this.http.post<{ message: string, imagePath: string }>(BACKEND_URL + '/upload-profile-pic/' + uId, uploadData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getBirthdays(licenseId: string) {
    return this.http.get<{users: any}>(BACKEND_URL + '/birthdays/' + licenseId);
  }

  getAllNew(licenseId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ count: number }>(
        BACKEND_URL + '/new/' + licenseId
      );
  }
}
