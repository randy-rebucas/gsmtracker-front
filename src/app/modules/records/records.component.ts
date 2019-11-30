import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  public patientId: string;
  public fullname: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.activatedRoute.parent.params.subscribe(
      (param) => {
        this.patientId = param.patientId;
      }
    );

    this.userService.get(this.patientId).subscribe((patient) => {
      console.log(patient);

    });

  }

}
