import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ComplaintData } from '../../models/complaint-data.model';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-chief-complaint-latest',
  templateUrl: './chief-complaint-latest.component.html',
  styleUrls: ['./chief-complaint-latest.component.css']
})
export class ChiefComplaintLatestComponent
extends SecureComponent
implements OnInit, OnDestroy {

  complaints: [];
  createdDate: string;
  complaintId: string;

  private mode = 'create';
  count: number;

  public recordsSub: Subscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,

    public route: ActivatedRoute,
    public complaintService: ComplaintService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
  ) {
    super(authService, router, dialog);
  }

  ngOnInit() {
    super.doInit();

    this.complaintService.getLatest().subscribe(recordData => {
      if (Object.keys(recordData).length) {
        this.complaintId = recordData[0]._id;
        this.createdDate = recordData[0].created;
        this.complaints = recordData[0].complaints;
      }
    });

    this.recordsSub = this.complaintService
      .getUpdateListener()
      .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
        this.isLoading = false;
        this.complaintService.getLatest().subscribe(recordData => {
          if (Object.keys(recordData).length) {
            this.complaintId = recordData[0]._id;
            this.createdDate = recordData[0].created;
            this.complaints = recordData[0].complaints;
          }
          this.count = complaintData.count;
        });
      });
    }

  ngOnDestroy() {
    super.doDestroy();
  }
}
