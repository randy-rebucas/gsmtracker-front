import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ParamMap, ActivatedRoute, Params } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styles: [`
  :host /deep/ .mat-card-header-text {
    /* CSS styles go here */
    margin: 0px;
  }
  .mat-card-subtitle {
    margin-bottom: unset;
  }
  .mat-card-title {
    margin-bottom: unset !important;
    font-size: 14px;
  }
  mat-card {
    margin-bottom: 1em;
    border-radius: 0;
  }
  button.mat-menu-trigger {
    position: absolute;
    right: 0;
    top: 5px;
  }

  `]
})
export class EndrosementComponent
extends SecureComponent
implements OnInit, OnDestroy {
  panelOpenState = true;
  listOpenState = true;

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

    this.activatedRoute.parent.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );
    this.isLoading = false;
    this.form = new FormGroup({
      order: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(500) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });
  }

  onOpenForm() {
    this.panelOpenState = ! this.panelOpenState;
  }

  onOpenList() {
    this.listOpenState = ! this.listOpenState;
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
