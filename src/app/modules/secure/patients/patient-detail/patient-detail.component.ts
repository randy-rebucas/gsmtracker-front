import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';


@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  user: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UserService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (param) => {
        this.usersService.get(param.patientId).subscribe((user) => {
          this.user = user;
          console.log(this.user);
        });
      }
    );
  }

}
