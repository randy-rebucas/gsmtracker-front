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
  patientId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UserService
  ) { }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.params.patientId;

    this.usersService.get(this.patientId).subscribe((user) => {
      this.user = user;
    });

  }

  onSetRecord(record: any) {
    localStorage.setItem('record', record);
  }
}
