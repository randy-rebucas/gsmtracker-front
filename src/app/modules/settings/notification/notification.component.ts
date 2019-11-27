import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SettingsService } from '../settings.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public form: FormGroup;
  public settingId: string;
  private userId: string;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.userId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.titleService.setTitle('Settings - Notification');

    this.form = this.fb.group({
      deletedPatient: [true],
      createdAppointment: [true],
      cancelAppointment: [true],
      sentMessage: [true],
      newFeatures: [true],
      newUpdates: [true],
      subscriptionPlan: [false]
    });

    this.settingsService.getSetting(this.userId)
    .subscribe(settingData => {
      if (settingData) {
        const notification = settingData.notification;
        this.settingId = settingData.settingId;
        this.form.patchValue({
          deletedPatient: (notification.length) ? notification[0].deletedPatient : true,
          createdAppointment: (notification.length) ? notification[0].createdAppointment : true,
          cancelAppointment: (notification.length) ? notification[0].cancelAppointment : true,
          sentMessage: (notification.length) ? notification[0].sentMessage : true,
          newFeatures: (notification.length) ? notification[0].newFeatures : true,
          newUpdates: (notification.length) ? notification[0].newUpdates : true,
          subscriptionPlan: (notification.length) ? notification[0].subscriptionPlan : false
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const updatedSetting = {
      id: this.settingId,
      userId: this.userId,
      deletedPatient: this.form.value.deletedPatient,
      createdAppointment: this.form.value.createdAppointment,
      cancelAppointment: this.form.value.cancelAppointment,
      sentMessage: this.form.value.sentMessage,
      newFeatures: this.form.value.newFeatures,
      newUpdates: this.form.value.newUpdates,
      subscriptionPlan: this.form.value.subscriptionPlan
    };

    this.settingsService.updateNotificaiton(updatedSetting).subscribe((notification) => {
      this.notificationService.success(notification.message);
    });

  }
}
