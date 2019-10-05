import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { ComplaintService } from '../services/complaint.service';
import { NotificationService } from 'src/app/shared/notification.service';

export interface Complaint {
  text: string;
}

@Component({
  selector: 'app-chief-complaint',
  templateUrl: './chief-complaint.component.html',
  styles: [`
  mat-form-field.record-date {
    width: 30%;
  }
  .mat-form-field {
    display: block;
  }
  .action-button button {
    margin-left: 8px;
    text-align: right;
  }
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
export class ChiefComplaintComponent
extends SecureComponent
implements OnInit, OnDestroy {
  panelOpenState = true;
  listOpenState = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private fb: FormBuilder,
    private complaintService: ComplaintService,
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
      complaint: new FormControl(null, {
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

    this.complaintService.insert(
      this.form.value.record_date,
      this.patientId,
      this.form.value.complaint
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
      // redirect histories
    });

  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
