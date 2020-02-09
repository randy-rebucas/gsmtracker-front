import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/shared/services/blockchain.service';
import { Blockchain } from 'src/app/shared/interfaces/blockchain';

@Component({
  selector: 'app-patient-record-detail',
  templateUrl: './patient-record-detail.component.html',
  styleUrls: ['./patient-record-detail.component.scss']
})
export class PatientRecordDetailComponent implements OnInit {
  blockId: string;
  blockchain: Blockchain;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blockchainService: BlockchainService
  ) { }

  ngOnInit() {
    this.blockId = this.activatedRoute.snapshot.params.blockId;
    console.log(this.blockId);
    this.blockchainService.get(this.blockId).subscribe((block) => {
      this.blockchain = block;
    });
  }

}
