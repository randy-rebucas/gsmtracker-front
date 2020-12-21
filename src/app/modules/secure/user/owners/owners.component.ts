import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { Owners } from './owners';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {

  public ownersNames: any;

  @Input() owners: Owners[];

  constructor(
    private userService: UserService
  ) {
    this.ownersNames = [];
   }

  ngOnInit() {

    this.owners.forEach(owner => {
      this.userService.get(owner.userId).subscribe((user) => {
        this.ownersNames.push(user.name.firstname + ' ' + user.name.lastname);
      });
    });

  }

}
