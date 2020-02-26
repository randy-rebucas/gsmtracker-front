import { Component, OnInit, Input } from '@angular/core';
import { Physicians } from 'src/app/modules/secure/user/physicians/physicians';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { User } from 'src/app/modules/secure/user/user';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.scss']
})
export class PhysicianComponent implements OnInit {
  @Input() physician: string;

  user: User;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.get(this.physician).subscribe((user) => {
      this.user = user;
    });
  }
}
