import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-physical-exams',
  templateUrl: './physical-exams.component.html',
  styles: [`
  .physical-exam-wrap {
    margin-top: 1em;
  }
  :host /deep/ .mat-list-item-content {
    color: #fff;
    font-size: 14px;
  }
  h3.mat-subheader {
    color: #fff !important;
    font-size: 16px !important;
    font-weight: 100 !important;
  }
  `]
})
export class PhysicalExamsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
