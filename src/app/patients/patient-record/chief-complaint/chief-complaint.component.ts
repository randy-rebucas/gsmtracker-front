import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';

export interface Complaint {
  text: string;
}

@Component({
  selector: 'app-chief-complaint',
  templateUrl: './chief-complaint.component.html',
  styleUrls: ['./chief-complaint.component.css']
})
export class ChiefComplaintComponent
extends SecureComponent
implements OnInit, OnDestroy {
  breakpoint: number;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    ) {
      super(authService, router, dialog);
    }

  ngOnInit() {
    super.doInit();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 2;
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
