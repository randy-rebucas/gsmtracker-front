import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { User } from 'src/app/modules/secure/user/user';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  email: string;
  user: User;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.email = this.authenticationService.getUserEmail();
    this.userService.get(this.authenticationService.getUserId()).subscribe((user) => {
      this.user = user;
    });

    console.log(this.user);
  }

}
