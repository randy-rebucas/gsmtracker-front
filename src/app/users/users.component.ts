import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { SecureComponent } from '../secure/secure.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent
extends SecureComponent
implements OnInit, OnDestroy {

  ngOnInit() {
    super.doInit();
  }

  ngOnDestroy() {
    super.doDestroy();
  }
}
