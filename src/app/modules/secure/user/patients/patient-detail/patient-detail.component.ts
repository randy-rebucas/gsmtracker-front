import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private patientsService: PatientsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.params.patientId;

    this.patientsService.get(this.patientId).subscribe((user) => {
      this.user = user;
    });

  }

  onCreate() {
    this.router.navigate(['./records/form'], {relativeTo: this.activatedRoute});
  }

  onSetRecord(record: any) {
    localStorage.setItem('record', record);
  }
}
