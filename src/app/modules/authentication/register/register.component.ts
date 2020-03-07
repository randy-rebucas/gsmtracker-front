import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export interface Practices {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    public titleService: Title,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('de'); // default language
    this.translate.use('en'); // override language
   }

  ngOnInit() {
    this.titleService.setTitle('Auth - Register');

    this.form = new FormGroup({
      firstname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      lastname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30)
        ]
      }),
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(12)
        ]
      })
    });
  }

  get formCtrls() { return this.form.controls; }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const authRegister = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authenticationService.createUser(authRegister);

    this.authenticationService.getAuthStatusListener().subscribe((res) => {
      if (!res) {
        this.isLoading = false;
      }
    });
  }

  onLogin() {
    this.router.navigate(['/auth/login']);
  }
}
