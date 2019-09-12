import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { SecureComponent } from '../secure/secure.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent
extends SecureComponent
implements OnInit, OnDestroy {

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
