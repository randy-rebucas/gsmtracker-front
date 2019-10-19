import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: './login.component.html',
  styles: [`
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }
  .login-page .content {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .login-page .content .app-name {
    margin-top: 0px;
      padding-bottom: 0px;
      margin-bottom: 0;
      font-size: 26px;
      font-weight: 100;
      text-align: left;
  }
  .login-page .content p.subheading {
    text-align: left;
    padding: 0;
    margin: 0 0 10px 0;
    font-size: 12px;
  }
  .login-page .content .login-form {
    padding: 40px;
    background: #fff;
    width: 500px;
    box-shadow: 0 0 10px #b7b7b7;

  }
  .login-page .content .login-form input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }

  .text-center {
    text-align: center;
  }
  .w-100 {
    width: 100%;
  }
  .footer {
    text-align: left;
    width: 100%;
  }
  .footer p {
    padding: 0 15px;
  }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;
  private cookieValue = null;

  loginForm: FormGroup;

  constructor(
    public router: Router,
    public authService: AuthService,
    public titleService: Title,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Auth - Login');
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });

    this.loginForm = new FormGroup({
      email: new FormControl((this.cookieService.check('email')) ? this.cookieService.get('email') : null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }),
      password: new FormControl((this.cookieService.check('pass')) ? this.cookieService.get('pass') : null, {
        validators: [
          Validators.required,
          Validators.maxLength(12)
        ]
      }),
      remember: new FormControl((this.cookieService.check('remember')) ? this.cookieService.get('remember') : null)
    });

  }

  get email() { return this.loginForm.get('email'); }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.remember);
  }

  onSignup() {
    this.router.navigate(['/auth/signup']);
  }

  onForgot() {
    this.router.navigate(['/auth/recovery']);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
