import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PatientRecordFormComponent } from '../patient-record-form/patient-record-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from '../../patients.service';

@Component({
  selector: 'app-patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss']
})
export class PatientRecordListComponent implements OnInit {
  public blockchains: Observable<Blockchain[]>;

  public perPage: number;
  public currentPage: number;

  public patientId: string;
  public blockchain: Blockchain;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private patientsService: PatientsService,
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.perPage = 10;
    this.currentPage = 1;
  }

  ngOnInit() {
    // get patientid parameter
    this.patientId = this.activatedRoute.snapshot.parent.parent.params.patientId;
    // get patient Info
    this.patientsService.get(this.patientId).subscribe((user) => {
      // get patient blockchain
      this.blockchains = this.blockchainService.getByUser(user.userId.privateKey);
    });
  }

  onCreate() {
    this.router.navigate(['../form'], {relativeTo: this.activatedRoute});
  }

  onViewRecord(blockchain: any) {
    this.router.navigate(['../', blockchain._id], {relativeTo: this.activatedRoute});
  }
}
