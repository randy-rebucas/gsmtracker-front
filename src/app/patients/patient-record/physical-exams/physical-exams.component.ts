import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-physical-exams',
  templateUrl: './physical-exams.component.html',
  styleUrls: ['./physical-exams.component.css']
})
export class PhysicalExamsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
