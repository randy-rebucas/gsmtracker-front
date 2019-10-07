import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { AuthSignup } from './auth-signup.model';
import { NotificationService } from '../shared/notification.service';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userEmail: string;
  private licenseId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getLicenseId() {
    return this.licenseId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(reqFirstName: string, reqLastName: string, reqClinicName: string, reqEmail: string, reqPassword: string) {
    const authSignup: AuthSignup = {
      firstname: reqFirstName,
      lastname: reqLastName,
      clinicname: reqClinicName,
      email: reqEmail,
      password: reqPassword
    };
    this.http.post(BACKEND_URL + '/signup', authSignup).subscribe((res) => {
      this.notificationService.success(':: Registered successfully!');
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(reqEmail: string, reqPassword: string) {
    const authData: AuthData = {email: reqEmail, password: reqPassword};
    this.http.post<{token: string, expiresIn: number, userEmail: string, userId: string, licenseId: string}>(
      BACKEND_URL + '/login',
      authData
    )
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;

        this.userId = response.userId;
        this.userEmail = response.userEmail;
        this.licenseId = response.licenseId;

        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, this.userId, this.userEmail, this.licenseId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;

      this.userId = authInformation.userId;
      this.userEmail = authInformation.userEmail;
      this.licenseId = authInformation.licenseId;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userEmail: string, licenseId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('licenseId', licenseId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('licenseId');
  }

  private getAuthData() {
    const authToken = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const authUserId = localStorage.getItem('userId');
    const authUserEmail = localStorage.getItem('userEmail');
    const authLicenseId = localStorage.getItem('licenseId');
    if (!authToken || !expirationDate) {
      return;
    }
    return {
      token: authToken,
      expirationDate: new Date(expirationDate),
      userId: authUserId,
      userEmail: authUserEmail,
      licenseId: authLicenseId
    };
  }
}
