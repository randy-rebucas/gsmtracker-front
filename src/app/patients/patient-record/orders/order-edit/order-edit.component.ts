import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

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

    private route: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
    this.route.params.subscribe(
        (param) => {
            console.log(param);
            this.orderId = param.orderId;
        }
      );
    this.form = new FormGroup({
      height: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });
  }

  onClose() {
    this.form.reset();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
