import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/auth/auth.service';
import { SecureComponent } from 'src/app/secure/secure.component';
import { AppConfiguration } from 'src/app/app-configuration.service';

@Component({
  selector: 'app-sample',
  styles: [``],
  templateUrl: './sample.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SampleComponent
extends SecureComponent
implements OnInit, OnDestroy {
  public userType: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public appconfig: AppConfiguration,
    private activatedRoute: ActivatedRoute
  ) {
    super(authService, router, dialog, appconfig);
    this.activatedRoute.params.subscribe(
      (param) => {
        this.userType = param.userType;
      }
    );
  }

  ngOnInit() {
    super.doInit();
    console.log(this.userType);
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
