import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { TypesData } from '../types/types-data.model';
import { TypesService } from '../types/types.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styles: [``]
})
export class TypesComponent
extends SecureComponent
implements OnInit, OnDestroy {

  public typeSub: Subscription;
  types: TypesData[] = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private typesService: TypesService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private route: ActivatedRoute
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.typesService.getAll(this.licenseId);
    this.typeSub = this.typesService
    .getUpdateListener()
    .subscribe((typeData: {types: TypesData[]}) => {
      this.isLoading = false;
      this.types = typeData.types;
    });
  }

  onDelete(quedId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.typesService.delete(quedId).subscribe(() => {
          this.typesService.getAll(this.licenseId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
