import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { AllergyService } from '../../services/allergy.service';

@Component({
  selector: 'app-allergy-edit',
  templateUrl: './allergy-edit.component.html',
  styles: [`
  mat-form-field.allergy-form {
    width: 100%;
}
form.allergy-form {
  margin-top: 1em;
}
`]
})
export class AllergyEditComponent
extends SecureComponent
implements OnInit, OnDestroy {

  private mode = 'create';

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public allergyService: AllergyService,

    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.activatedRoute.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );

    this.form = new FormGroup({
      allergy: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(50) ]
      })
    });
  }

  onSave(event) {
    if ( event.keyCode === 13) {
      // do your function
      if (this.form.invalid) {
        return;
      }
      this.allergyService.insert(
        this.form.value.allergy,
        this.patientId
      ).subscribe(() => {
        this.form.reset();
        this.notificationService.success(':: Added successfully');
        this.allergyService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    }
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
