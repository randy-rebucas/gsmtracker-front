import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from '../secure/secure.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent
extends SecureComponent
implements OnInit, OnDestroy {


  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public titleService: Title
  ) {
    super(authService, router, dialog);
  }

  ngOnInit() {
    super.doInit();
    this.titleService.setTitle('Appointments');
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
