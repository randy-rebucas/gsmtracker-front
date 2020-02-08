import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
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
  isLoading: boolean;
  practices: Practices[] = [
    {value: 'ALLERGY & IMMUNOLOGY', viewValue: 'ALLERGY & IMMUNOLOGY'},
    {value: 'ANESTHESIOLOGY', viewValue: 'ANESTHESIOLOGY'},
    {value: 'DERMATOLOGY', viewValue: 'DERMATOLOGY'},
    {value: 'DIAGNOSTIC RADIOLOGY', viewValue: 'DIAGNOSTIC RADIOLOGY'},
    {value: 'EMERGENCY MEDICINE', viewValue: 'EMERGENCY MEDICINE'},
    {value: 'FAMILY MEDICINE', viewValue: 'FAMILY MEDICINE'},
    {value: 'INTERNAL MEDICINE', viewValue: 'INTERNAL MEDICINE'},
    {value: 'MEDICAL GENETICS', viewValue: 'MEDICAL GENETICS'},
    {value: 'NEUROLOGY', viewValue: 'NEUROLOGY'},
    {value: 'NUCLEAR MEDICINE', viewValue: 'NUCLEAR MEDICINE'},
    {value: 'OBSTETRICS AND GYNECOLOGY', viewValue: 'OBSTETRICS AND GYNECOLOGY'},
    {value: 'PATHOLOGY', viewValue: 'PATHOLOGY'},
    {value: 'PEDIATRICS', viewValue: 'PEDIATRICS'},
    {value: 'PHYSICAL MEDICINE & REHABILITATION', viewValue: 'PHYSICAL MEDICINE & REHABILITATION'},
    {value: 'PREVENTIVE MEDICINE', viewValue: 'PREVENTIVE MEDICINE'},
    {value: 'PSYCHIATRY', viewValue: 'PSYCHIATRY'},
    {value: 'RADIATION ONCOLOGY', viewValue: 'RADIATION ONCOLOGY'},
    {value: 'SURGERY', viewValue: 'SURGERY'},
    {value: 'UROLOGY', viewValue: 'UROLOGY'}
  ];

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

    this.isLoading = false;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    const authRegister = {
      // name: form.value.name,
      // practice: form.value.practice,
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
      password: form.value.password
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
