import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styles: [``]
})
export class OrderEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  orderId: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private notificationService: NotificationService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
    this.activatedRoute.parent.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.myUserId;
      }
    );
    this.form = new FormGroup({
      order: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.orderService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.order
    ).subscribe(() => {
      this.form.reset();
      this.orderService.getAll(this.perPage, this.currentPage, this.patientId);
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
