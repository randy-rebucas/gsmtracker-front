import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/modules/secure/user/user.service';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent implements OnInit {

  public physiciansNames: any;

  @Input() physicians: any;
  constructor(
    private userService: UserService
  ) {
    this.physiciansNames = [];
   }

  ngOnInit() {
    
    this.physicians.forEach(physician => {
      this.userService.get(physician.userId).subscribe((user) => {
        this.physiciansNames.push(user.firstname + ' ' + user.lastname);
      });
    });

  }

}
