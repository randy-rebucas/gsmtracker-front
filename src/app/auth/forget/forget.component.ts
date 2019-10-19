import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './forget.component.html',
  styles: [`
  .forget-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }
  .forget-page .content {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .forget-page .content .app-name {
    margin-top: 0px;
    padding-bottom: 0px;
    margin-bottom: 0;
    font-size: 26px;
    font-weight: 100;
    text-align: left;
  }
  .forget-page .content p.subheading {
    text-align: left;
    padding: 0;
    margin: 0 0 10px 0;
    font-size: 12px;
  }
  .forget-page .content .forget-form {
    padding: 40px;
    background: #fff;
    width: 500px;
    box-shadow: 0 0 10px #b7b7b7;

  }
  .forget-page .content .forget-form input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }

  .text-center {
    text-align: center;
  }
  .w-100 {
    width: 100%;
  }

  `]
})
export class ForgetComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(
    public router: Router,
    public authService: AuthService,
    public titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Auth - Recover Password');
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onForget( form: NgForm ) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // this.authService.login(form.value.email, form.value.password);
  }

  onSignup() {
    this.router.navigate(['/auth/signup']);
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
