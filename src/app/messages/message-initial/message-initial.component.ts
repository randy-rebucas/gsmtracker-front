import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-message-initial',
  templateUrl: './message-initial.component.html',
  styleUrls: ['./message-initial.component.css']
})
export class MessageInitialComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog
  ) {
    super(authService, router, dialog);
  }

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
