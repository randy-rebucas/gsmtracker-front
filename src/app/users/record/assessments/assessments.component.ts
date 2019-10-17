import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { AssessmentService } from '../services/assessment.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
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
export class AssessmentsComponent
extends SecureComponent
implements OnInit, OnDestroy {
  panelOpenState = true;
  listOpenState = true;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();
  }

  onOpenForm() {
    this.panelOpenState = ! this.panelOpenState;
  }

  onOpenList() {
    this.listOpenState = ! this.listOpenState;
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
