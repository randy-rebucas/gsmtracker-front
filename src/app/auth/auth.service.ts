import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { AuthSignup } from './auth-signup.model';
import { NotificationService } from '../shared/notification.service';
import { CookieService } from 'ngx-cookie-service';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated: boolean;
  private token: string;
  private userId: string;
  private userEmail: string;
  private userType: string;
  private licenseId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private cookieService: CookieService
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return (localStorage.hasOwnProperty('token')) ? true : false;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getUserType() {
    return this.userType;
  }

  getLicenseId() {
    return this.licenseId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(FirstName: string, LastName: string, ClinicName: string, Email: string, Password: string) {
    const authSignup: AuthSignup = {
      firstname: FirstName,
      lastname: LastName,
      clinicname: ClinicName,
      email: Email,
      password: Password
    };
    this.http.post<{message: string}>(BACKEND_URL + '/signup', authSignup).subscribe((res) => {
      this.notificationService.success(res.message);
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(Email: string, Password: string, Remember: boolean) {
    const authData: AuthData = {email: Email, password: Password, remember: Remember};
    this.http.post<{token: string, userEmail: string, userId: string, userType: string, licenseId: string}>(
      BACKEND_URL + '/login',
      authData
    )
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {

        this.userId = response.userId;
        this.userEmail = response.userEmail;
        this.userType = response.userType;
        this.licenseId = response.licenseId;

        this.authStatusListener.next(true);

        if (Remember) {
          this.cookieService.set('remember', (Remember) ? 'yes' : 'no' );
          this.cookieService.set('email', Email );
          this.cookieService.set('pass', Password );
        }

        this.saveAuthData(token, this.userId, this.userEmail, this.userType, this.licenseId);
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
    this.token = authInformation.token;

    this.userId = authInformation.userId;
    this.userEmail = authInformation.userEmail;
    this.userType = authInformation.userType;
    this.licenseId = authInformation.licenseId;
    this.authStatusListener.next(true);
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.userType = null;
    this.licenseId = null;
    this.userEmail = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, userId: string, userEmail: string, userType: string, licenseId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userType', userType);
    localStorage.setItem('licenseId', licenseId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('licenseId');
  }

  private getAuthData() {
    const authToken = localStorage.getItem('token');
    const authUserId = localStorage.getItem('userId');
    const authUserEmail = localStorage.getItem('userEmail');
    const authUserType = localStorage.getItem('userType');
    const authLicenseId = localStorage.getItem('licenseId');
    return {
      token: authToken,
      userId: authUserId,
      userEmail: authUserEmail,
      userType: authUserType,
      licenseId: authLicenseId
    };
  }
}
