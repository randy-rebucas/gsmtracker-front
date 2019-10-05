import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EndorsementService } from '../../services/endorsement.service';

@Component({
  selector: 'app-endorsement-form',
  templateUrl: './endorsement-form.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 45%;
  }
  .mat-form-field {
    display: block;
  }
  .form-field-block {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    flex-basis: auto;
  }
  `]
})
export class EndorsementFormComponent
extends SecureComponent
implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public endorsementService: EndorsementService,
    private notificationService: NotificationService,
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

    this.form = new FormGroup({
      endorsementRef: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(100) ]
      }),
      endorsement: new FormControl(null, {
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

    this.endorsementService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.endorsement,
      this.form.value.endorsementRef
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.endorsementService.getAll(this.perPage, this.currentPage, this.patientId);
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
