import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  form: FormGroup;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    public titleService: Title,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('de'); // default language
    this.translate.use('en'); // override language
   }

  ngOnInit() {
    this.titleService.setTitle('Authentication - Login');

    this.form = new FormGroup({
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

  get email() { return this.form.get('email'); }

  onLogin() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const authData = {
      email: this.form.value.email,
      password: this.form.value.password,
      remember: this.form.value.remember
    };

    this.authenticationService.login(authData);

    this.authenticationService.getAuthStatusListener().subscribe((res) => {
      if(!res) {
        this.isLoading = false;
      }
    });
  }

  onSignup() {
    this.router.navigate(['/auth/register']);
  }
}
