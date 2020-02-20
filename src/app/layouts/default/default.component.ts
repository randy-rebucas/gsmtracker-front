import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() { }


  sideBarToggler(e) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  onLogout(isLogedOut: boolean): void {
    this.authenticationService.logout();
  }

}
