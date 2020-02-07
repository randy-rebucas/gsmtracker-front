import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { User } from '../../user';
import { PatientsService } from '../patients.service';


@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  user: any;
  patientId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UserService,
    private patientsService: PatientsService
  ) { }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.params.patientId;

    this.patientsService.get(this.patientId).subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });

  }

  onSetRecord(record: any) {
    localStorage.setItem('record', record);
  }
}
