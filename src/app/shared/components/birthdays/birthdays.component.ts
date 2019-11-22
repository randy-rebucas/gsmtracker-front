import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/user/user.service';

@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss']
})
export class BirthdaysComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // this.userService.getBirthdays().subscribe((birthday) => {
    //   birthday.users.forEach(user => {
    //     const today = new Date();
    //     const bDate = new Date(user.people.birthdate);
    //     let myage = today.getFullYear() - bDate.getFullYear();
    //     const m = today.getMonth() - bDate.getMonth();
    //     if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
    //       myage--;
    //     }
    //     const obj = {
    //       useId: user.users._id,
    //       birthdate: user.people.birthdate,
    //       age: myage,
    //       fullname: user.people.firstname + ', ' + user.people.lastname,
    //       avatar: user.users.avatarPath,
    //       contact: user.people.contact
    //     };
    //     this.users.push(obj);
    //   });
    //   this.birthdays = this.users;
    // });
  }

}
