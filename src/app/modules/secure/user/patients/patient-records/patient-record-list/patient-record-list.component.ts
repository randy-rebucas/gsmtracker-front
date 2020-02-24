import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';
import { Observable } from 'rxjs';

import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { PatientsService } from '../../patients.service';

@Component({
  selector: 'app-patient-record-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.scss']
})
export class PatientRecordListComponent implements OnInit {
  public blockchains: Observable<Blockchain[]>;
  public blockchain: Blockchain;
  public patientId: string;

  isLoading: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private patientsService: PatientsService,
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    // get patientid parameter
    this.patientId = this.activatedRoute.snapshot.parent.params.patientId;
    // get patient Info
    this.patientsService.get(this.patientId).subscribe((user) => {
      // get patient blockchain
      this.blockchains = this.blockchainService.getByUser(user.userId.publicKey);
      this.isLoading = false;
    });
  }

  onCreate() {
    this.router.navigate(['../form'], {relativeTo: this.activatedRoute});
  }

  onViewRecord(blockchain: any) {
    this.router.navigate(['../', blockchain._id], {relativeTo: this.activatedRoute});
  }
}
