import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { AllergyData } from '../../models/allergy-data.model';
import { AllergyService } from '../../services/allergy.service';

import { MatDialog } from '@angular/material';
import { DialogService } from 'src/app/shared/dialog.service';

import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-allergy-list',
  templateUrl: './allergy-list.component.html',
  styles: [`
  .mat-list-item-content button {
    position: absolute;
    right: 0;
  }
  `]
})
export class AllergyListComponent
extends SecureComponent
implements OnInit, OnDestroy {

  allergies: AllergyData[] = [];
  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    public allergyService: AllergyService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
      this.activatedRoute.parent.parent.parent.params.subscribe(
        (param) => {
          this.patientId = param.myUserId;
        }
      );
    }

  ngOnInit() {
    super.doInit();

    this.allergyService.getAll(this.perPage, this.currentPage, this.patientId);
    this.recordsSub = this.allergyService
    .getUpdateListener()
    .subscribe((allergyData: {allergies: AllergyData[], count: number}) => {
      this.isLoading = false;
      this.total = allergyData.count;
      this.allergies = allergyData.allergies;
    });
  }

  onDelete(allergyId) {
    console.log(allergyId);
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.allergyService.delete(allergyId).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.allergyService.getAll(this.perPage, this.currentPage, this.patientId);
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
