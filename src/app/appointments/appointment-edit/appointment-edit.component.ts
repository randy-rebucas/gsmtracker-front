import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  assessmentId: string;
  userId: string;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  minDate = new Date();
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService
    ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
        title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
        }),
        start: new FormControl(null, {
          validators: [Validators.required]
        }),
        end: new FormControl(null, {
          validators: [Validators.required]
        })
      });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.appointmentService.insert(
      this.form.value.title,
      this.form.value.start,
      this.form.value.end,
      this.userId
    ).subscribe(() => {
      this.notificationService.success(':: Added successfully');
      this.appointmentService.getAll(this.userId, this.perPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
