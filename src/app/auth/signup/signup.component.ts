import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './signup.component.html',
  styles: [`
  .signup-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }
  .signup-page .content {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .signup-page .content .app-name {
    margin-top: 0px;
      padding-bottom: 0px;
      margin-bottom: 0;
      font-size: 26px;
      font-weight: 100;
      text-align: left;
  }
  .signup-page .content p.subheading {
    text-align: left;
    padding: 0;
    margin: 0 0 10px 0;
    font-size: 12px;
  }
  .signup-page .content .signup-form {
    padding: 40px;
    background: #fff;
    width: 500px;
    box-shadow: 0 0 10px #b7b7b7;

  }
  .signup-page .content .signup-form input:-webkit-autofill {
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
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public router: Router,
    public authService: AuthService,
    public titleService: Title
    ) {}

  ngOnInit() {
    this.titleService.setTitle('Auth - Signup');
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.firstname, form.value.lastname, form.value.clinicname, form.value.email, form.value.password);
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
