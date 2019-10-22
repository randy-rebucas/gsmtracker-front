import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AppConfiguration } from '../app-configuration.service';
import { SecureComponent } from '../secure/secure.component';
import { FormControl } from '@angular/forms';
import { TypesService } from '../shared/types/types.service';
import { Subscription } from 'rxjs';
import { TypesData } from '../shared/types/types-data.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent
extends SecureComponent
implements OnInit, OnDestroy {
  types: TypesData[];
  private typesSubscription: Subscription;
  
  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,

    private typesService: TypesService
    ) {
      super(authService, router, dialog, appconfig);
    }

  ngOnInit() {
    super.doInit();

    this.typesService.getAll(this.licenseId);
    this.typesSubscription = this.typesService
        .getUpdateListener()
        .subscribe((data: {types: TypesData[], counts: number}) => {
          this.total = data.counts;
          this.types = data.types;
        });
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
