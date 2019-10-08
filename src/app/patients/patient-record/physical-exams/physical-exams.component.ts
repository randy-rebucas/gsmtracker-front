import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecureComponent } from 'src/app/secure/secure.component';

@Component({
  selector: 'app-physical-exams',
  templateUrl: './physical-exams.component.html',
  styles: [`
  .physical-exam-wrap {
    margin-top: 1em;
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
