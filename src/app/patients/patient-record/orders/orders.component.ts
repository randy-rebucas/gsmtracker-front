import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, ParamMap, ActivatedRoute, Params } from '@angular/router';
import { SecureComponent } from 'src/app/secure/secure.component';
import { MatDialog } from '@angular/material';
import { AppConfiguration } from 'src/app/app-configuration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: [``]
})
export class OrdersComponent
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

    this.form = new FormGroup({
        height: new FormControl(null, {
          validators: [Validators.required, Validators.maxLength(5) ]
        }),
        record_date: new FormControl(new Date(), {
          validators: [Validators.required]
        })
    });

    // if (this.recordId) {
    //     this.isLoading = true;
    //     this.heightService.get(this.recordId).subscribe(recordData => {
    //       this.isLoading = false;
    //       this.heightData = {
    //         id: recordData._id,
    //         height: recordData.height,
    //         created: recordData.created,
    //         patientId: recordData.patientId
    //       };
    //       this.form.setValue({
    //         height: this.heightData.height,
    //         record_date: this.heightData.created
    //       });
    //     });
    // } else {
    //     this.isLoading = false;
    //     this.recordId = null;
    // }
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
