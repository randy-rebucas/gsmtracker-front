import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss']
})
export class BirthdaysComponent implements OnInit {

  private users: any[] = [];

  public birthdays: any[] = [];
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getBirthdays().subscribe((birthday) => {
      const birthdayCeleb = birthday.users;

      if (birthdayCeleb.length) {
        birthdayCeleb.forEach(user => {
          // get the avatar
          const obj = {
            useId: user._id,
            birthdate: user.birthdate,
            age: moment().diff(user.birthdate, 'years'),
            fullname: user.name.firstname + ' ' + user.name.midlename + ' ' + user.name.lastname,
            avatar: user.avatarPath,
            contact: user.contact
          };
          this.users.push(obj);
        });
      }
      

      this.birthdays = this.users;
    });
  }

}
